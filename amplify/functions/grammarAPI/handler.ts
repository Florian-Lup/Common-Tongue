import type { APIGatewayProxyHandler } from "aws-lambda";
import { grammarPipeline } from "../../../src/LLMs/workflows/grammarPipeline";

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin":
    process.env.CORS_ORIGIN?.replace(/\/$/, "") || "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST",
  "Access-Control-Allow-Headers":
    "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
  "Access-Control-Allow-Credentials": "true",
};

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { text } = body;

    const editedText = await grammarPipeline.invoke(text);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ editedText }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
