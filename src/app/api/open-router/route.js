import axios from "axios";
const { S3 } = require("aws-sdk");

import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPEN_ROUTER_API_KEY,
 
});

async function main() {
  const completion = await openai.chat.completions.create({
    model: 'openai/gpt-4o',
    messages: [
      {
        role: 'user',
        content: 'What is the meaning of life?',
      },
    ],
  });
  console.log("completion===============",completion);

  let result = {
    status: true,
    responseData: completion.choices[0].message.content,
    input_tokens: completion.usage.prompt_tokens,
    output_tokens: completion.usage.completion_tokens,
  };

  return result;
}


// OpenRouter API Configurations
const OPENROUTER_API_KEY = process.env.OPEN_ROUTER_API_KEY;
const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

// AWS S3 Configuration
const s3Client = new S3({
    region: process.env.AWS_REGION ?? "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    },
});


// Quarter Mapping
const quarterMapping = {
    "1st": 1,
    "2nd": 2,
    "3rd": 3,
    "4rth": 4,
    "4th": 4,
    "Q1": 1,
    "Q2": 2,
    "Q3": 3,
    "Q4": 4,
    "first": 1,
    "second": 2,
    "third": 3,
    "fourth": 4,
};

/**
 * Generates an S3 URI from the given object.
 */
const generateS3Uri = (obj) => {
    if (!obj.ticker || !obj.year || !obj.quarter) {
        throw new Error("Missing required fields: ticker, year, or quarter.");
    }

    const quarterNumber = quarterMapping[obj.quarter];
    if (!quarterNumber) {
        throw new Error(`Invalid quarter value: ${obj.quarter}`);
    }
    return `s3://earnings-calls-transcripts/transcripts/json/${obj.ticker}/${obj.year}/Q${quarterNumber}.json`;
};

// Function to fetch JSON from S3
async function fetchJsonFromS3(fileUrl) {
    try {
        const { bucket, key } = parseS3Uri(fileUrl);
        const params = { Bucket: bucket, Key: key };

        const data = await s3Client.getObject(params).promise();
        return JSON.parse(data.Body.toString("utf-8"));
    } catch (error) {
        console.error("Error fetching JSON:", error);
        return null;
    }
}

// Function to extract bucket name and key from S3 URI
const parseS3Uri = (s3Uri) => {
    const match = s3Uri.match(/^s3:\/\/([^/]+)\/(.+)$/);
    if (!match) {
        throw new Error("Invalid S3 URI format.");
    }
    return { bucket: match[1], key: match[2] };
};

// Function to extract JSON from text
const extractJSON = (text) => {
    const match = text.match(/```json\n([\s\S]*?)\n```/);
    return match ? match[1] : "No valid JSON found";
};

// ✅ Get Answer for Prompt Using OpenRouter
const getAnswerForPrompt = async function* (
    source,
    prompt,
    chats,
    context,
    persona,
    foundationModel,
    fmTemperature,
    fmMaxTokens
) {
    try {
        if (!prompt || prompt.trim().length === 0) {
            yield "⚠️ **Error:** The question is unclear. Please provide more details.";
            return;
        }

        if (!source || source.trim().length === 0) {
            yield "⚠️ **Note:** No reference data available. Providing a general response:";
        }

        const requestBody = {
            model: foundationModel || "gpt-4o", // Default to GPT-4o
            messages: [
                {
                    role: "system",
                    content: `You are provided transcript(s) of earnings-calls.Answer the prompt based on the provided context.\n\n\nContext:${source}\n\n\nPrompt:${prompt}\n\n\n.Generate your response for someone who is a ${persona},
                        and with proper markdown formatting.Consider this additional context as well when generating response.\n
                        Additional Context:${context}.Do not consider the additional context if it's not meaningful to the current prompt and Context.\n\nNever ever disclose or mention your source of information based on which you are answering the prompt,and that you are providing your response with markdown formatting.If question is unrelated to the provided context,then do not answer the prompt.`,
                },
            ],
            max_tokens: fmMaxTokens,
            temperature: fmTemperature,
            stream: true,
        };

        const response = await axios.post(OPENROUTER_ENDPOINT, requestBody, {
            headers: {
                Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
            responseType: "stream",
        });

        for await (const chunk of response.data) {
            if (chunk.choices?.[0]?.delta?.content) {
                yield chunk.choices[0].delta.content;
            }
        }
    } catch (error) {
        console.error("Unexpected error:", error);
        yield "❌ **Error:** Unable to process your request at the moment. Please try again later.";
    }
};

// ✅ Optimize Prompt Using OpenRouter
const optimizePrompt = async (
    previousPrompts,
    rawPrompt,
    selectedCompanies,
    selectedQuarter,
    selectedYear,
    chats
) => {
    try {
        const previousPromptsString = previousPrompts.join("\n\n");

        const requestBody = {
            model: 'openai/gpt-4o',
                        messages: [
                ...chats.slice(-5),
                {
                    role: "user",
                    content: `Based on previous prompts,you need to make current prompt more clear only if it is not and it is stemming from previous prompt(s) else just return the prompt as it is without modifying it.\n\nPrevious prompts:${previousPromptsString}\n\n\nCurrent prompt:${rawPrompt}.\n\n\nFor example if current prompt is "just for sofi" and previous prompts is "Who were the analysts?",then you have to make current prompt more clear by framing it as "Who were the analysts for sofi?".
            Consider these informations as well Selected Companies: ${selectedCompanies}.\n\nSelected Quarter:${selectedQuarter}\n\nSelected Year${selectedYear}\n\n\n
            From your generated response, infer the required company ticker(s), quarter(s), and year(s) for which transcripts are needed.If you infer that you need for all the quarters,then insert four values.Transcripts are only available for the year 2024.
            For quarter,use Q1,Q2,Q3,Q4 and for year,use 2024.If you think that prompt is about a previous response in that chats history and no need to fetch transcripts again,then set
            fetch_transcripts to false else set it to true.
        Return your response in JSON format:
        \`\`\`json
       {
        queryParamsArray: [
            { "ticker": "<company_ticker>", "quarter": "<quarter>", "year": "<year>" }
        ],
        prompt: "<refined and clear prompt>",
        fetch_transcripts: <either true or false>
        } 
`,
                },
            ],
            // maxTokens: 1000,
            // temperature: 0,
        };

        const response = await axios.post(OPENROUTER_ENDPOINT, requestBody, {
            headers: {
                Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
        });

        const responseData = response.data;
        const responseText = responseData?.choices?.[0]?.message?.content || "No response received";
        const extractedJSON = extractJSON(responseText);
        return JSON.parse(extractedJSON);
    } catch (error) {
        console.error("Unexpected error:", error);
        throw error;
    }
};

// ✅ Generate Response Using OpenRouter
const generateResponse = async (
    prompt,
    rawPrompt,
    chats,
    context,
    persona,
    foundationModel,
    fmTemperature,
    fmMaxTokens,
    previousPrompts,
    selectedCompanies,
    selectedQuarter,
    selectedYear
) => {
    try {
        console.log("selectedCompanies", selectedCompanies);
        const optimizedPrompt = await optimizePrompt(
            previousPrompts,
            previousPrompts.length ? rawPrompt : prompt,
            JSON.stringify(selectedCompanies),
            selectedQuarter,
            selectedYear,
            chats
        );

        const queryParamsArray = optimizedPrompt?.queryParamsArray;
        console.log("queryParamsArray", queryParamsArray);

        if (!queryParamsArray || queryParamsArray.length === 0 || queryParamsArray[0].ticker === "ALL") {
            return "⚠️ **Error:** The request could not be processed. Please refine your query and try again.";
        }

        if (optimizedPrompt.fetch_transcripts) {
            const s3urls = queryParamsArray.map(generateS3Uri);
            const jsonFiles = await Promise.all(s3urls.map(fetchJsonFromS3));
            const transformedData = jsonFiles.map((item) => ({
                id: item.id,
                company_name: item.company_name,
                event: item.event,
                year: item.year,
                transcript: item.transcript.map((t) => t.text).join(" "), // Join all transcript texts
            }));
            return getAnswerForPrompt(
                JSON.stringify(transformedData),
                optimizedPrompt.prompt,
                chats,
                context,
                persona,
                foundationModel,
                fmTemperature,
                fmMaxTokens
            );
        } else {
            return getAnswerForPrompt(
                JSON.stringify(chats),
                optimizedPrompt.prompt,
                chats,
                context,
                persona,
                foundationModel,
                fmTemperature,
                fmMaxTokens
            );
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

// ✅ POST API Handler
export async function POST(req) {
    try {
        const body = await req.json();
        const {
            inputText,
            inputValue,
            chats,
            context,
            persona,
            foundationModel,
            fmTemperature,
            fmMaxTokens,
            previousPrompts,
            selectedCompanies,
            selectedQuarter,
            selectedYear,
        } = body;
await main()
        const stream = await generateResponse(
            inputText,
            inputValue,
            chats,
            context,
            persona,
            foundationModel,
            fmTemperature,
            fmMaxTokens,
            previousPrompts,
            selectedCompanies,
            selectedQuarter,
            selectedYear
        );

        return new Response(
            new ReadableStream({
                async start(controller) {
                    for await (const chunk of stream) {
                        controller.enqueue(new TextEncoder().encode(chunk));
                    }
                    controller.close();
                },
            }),
            {
                headers: {
                    "Content-Type": "text/plain; charset=utf-8",
                    "Cache-Control": "no-cache",
                },
            }
        );
    } catch (error) {
        console.error("POST Error:", error);
        return new Response("Error occurred", { status: 500 });
    }
}
