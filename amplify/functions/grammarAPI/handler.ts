import { APIGatewayProxyHandler } from "aws-lambda";
import { SQS } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const sqs = new SQS();

/**
 * CORS headers configuration for API responses
 * Allows specified origins to access the API and defines allowed methods/headers
 */
const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": process.env.CORS_ORIGIN || "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST",
  "Access-Control-Allow-Headers":
    "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
  "Access-Control-Allow-Credentials": "true",
};

/**
 * Lambda function handler for the grammar API endpoint
 * @param event - API Gateway event containing the request details
 * @returns Promise containing API response with edited text or error
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { text } = body;
    const requestId = uuidv4();

    // Send message to SQS
    await sqs
      .sendMessage({
        QueueUrl: process.env.GRAMMAR_QUEUE_URL!,
        MessageBody: JSON.stringify({ text, requestId }),
      })
      .promise();

    return {
      statusCode: 202,
      headers: corsHeaders,
      body: JSON.stringify({
        requestId,
        message: "Text processing started",
        status: "PROCESSING",
      }),
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
