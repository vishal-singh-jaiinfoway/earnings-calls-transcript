import { NextResponse } from "next/server";
import {
    BedrockRuntimeClient,
    InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const bedrockClient = new BedrockRuntimeClient({
    region: process.env.AWS_REGION ?? "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    },
});

export async function POST(req) {
    try {
        const { prompt, companies, chartData } = await req.json();
        console.log("chartData", chartData);
        if (!prompt) {
            return NextResponse.json(
                { error: "Prompt is required" },
                { status: 400 },
            );
        }

        const modelCommand = new InvokeModelCommand({
            modelId: "anthropic.claude-3-5-sonnet-20240620-v1:0",
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify({
                anthropic_version: "bedrock-2023-05-31",
                messages: [
                    {
                        role: "user",
                        content: `
              Your task is to provide data for company/companies to create charts. 
              If the current prompt is not clear enough, refer to the context provided as the current prompt could be stemming from previous context.
              
              Here is the Prompt:
              ${prompt}
              
              Companies:
              ${JSON.stringify(companies)}
              
              Previous context:
              ${JSON.stringify(chartData)}
              
              In case the prompt is about updating a previous chart, mention the index number of that chartData and set isUpdate to true, otherwise set it to false.
              
              Return your response in JSON format:
              \`\`\`json
              {
                "chartType": <options are 'line',
                  'area',
                  'candlestick',
                  'bar',
                  'column',
                  'stackedBar',
                  'stackedColumn',
                  'pie',
                  'donut',
                  'ohlc',
                  'scatter',
                  'bubble',
                  'waterfall',
                  'heatmap'>,
                "chartData": <in the format that igniteui-react-charts for 'ohlc', 'waterfall',
                  'heatmap',and 'candlestick' ,and for all other chart types in the format that react-chartjs-2 expects >,
                "title": <chart title>,
                "index": <index number>,
                "isUpdate": <true/false>
                "insights":<insights about chart data>
              }
              \`\`\`
              `,
                    },
                ],

                max_tokens: 1000,
                temperature: 0.7,
                top_p: 0.999,
            }),
        });

        const response = await bedrockClient.send(modelCommand);
        const responseData = JSON.parse(
            Buffer.from(response.body).toString("utf-8"),
        );
        const responseText =
            responseData?.content?.map((item) => item.text).join("\n") ||
            "No response received";
        console.log("responseText", responseText);
        const extractedJSON = extractJSON(responseText);
        console.log("extractedJSON", extractedJSON);

        return NextResponse.json(
            { data: JSON.parse(extractedJSON) },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error invoking Bedrock model:", error);
        return NextResponse.json(
            { error: "Failed to invoke model" },
            { status: 500 },
        );
    }
}

// Function to extract JSON from text
const extractJSON = (text) => {
    const match = text.match(/```json\n([\s\S]*?)\n```/);
    return match ? match[1] : "No valid JSON found";
};
