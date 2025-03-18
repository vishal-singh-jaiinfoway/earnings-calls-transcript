import { NextResponse } from 'next/server';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

const bedrockClient = new BedrockRuntimeClient({
    region: process.env.AWS_REGION ?? "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    },
});


export async function POST(req) {
    try {
        const { prompt,companies } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
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
                        content: `Your task is to provide data for company/companies to create charts.Here is the Prompt:${prompt}\n\n\nCompanies:${JSON.stringify(companies)}
           Return your response in JSON format:
           \`\`\`json
          {
           
           chartType: <options are 
  'line',
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
  'heatmap'
>,
           chartData: <in the format that recharts expect,follow this format ${JSON.stringify({
            "line": ["name", "value"],
            "area": ["name", "value"],
            "candlestick": ["name", "open", "high", "low", "close"],
            "bar": ["name", "value"],
            "column": ["name", "value"],
            "stackedBar": ["name", "value1", "value2"],
            "stackedColumn": ["name", "value1", "value2"],
            "pie": ["name", "value"],
            "donut": ["name", "value"],
            "ohlc": ["name", "open", "high", "low", "close"],
            "scatter": ["x", "y"],
            "bubble": ["x", "y", "size"],
            "waterfall": ["name", "value", "type"],
            "heatmap": ["x", "y", "value"]
          }
          )}">,title:<chart title>
           
           } 
   
             `
                    }
                ],
                max_tokens: 1000,
                temperature: 0.7,
                top_p: 0.999,
            })
        });

        const response = await bedrockClient.send(modelCommand);
        const responseData = JSON.parse(Buffer.from(response.body).toString("utf-8"));
        const responseText = responseData?.content?.map(item => item.text).join("\n") || "No response received";
        console.log("responseText",responseText);
        const extractedJSON = extractJSON(responseText);
        return NextResponse.json({ data: JSON.parse(extractedJSON) }, { status: 200 });
    } catch (error) {
        console.error('Error invoking Bedrock model:', error);
        return NextResponse.json({ error: 'Failed to invoke model' }, { status: 500 });
    }
}


// Function to extract JSON from text
const extractJSON = (text) => {
    const match = text.match(/```json\n([\s\S]*?)\n```/);
    return match ? match[1] : "No valid JSON found";
};