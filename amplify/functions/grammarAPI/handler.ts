import { APIGatewayProxyHandler } from "aws-lambda";
import { SQS } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { RateLimiter } from "../../../src/utils/rateLimiter";

const sqs = new SQS();

const rateLimiter = new RateLimiter({
  tokensPerInterval: 100,
  interval: 60000, // 1 minute in milliseconds
  fireImmediately: true,
});

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
 * Validates incoming requests for text processing
 * Checks text length, format, and rate limits
 * @param text The input text to validate
 * @throws Error if validation fails
 */
const validateRequest = (text: string): void => {
  if (!text || typeof text !== "string") {
    throw new Error("Invalid input: text is required");
  }

  if (text.length > 10000) {
    throw new Error("Text exceeds maximum length of 10000 characters");
  }

  if (!rateLimiter.tryRemoveTokens(1)) {
    throw new Error("Rate limit exceeded");
  }
};

/**
 * Handles incoming API requests for grammar processing
 * Queues text for processing and returns a request ID
 * @param event API Gateway event
 * @returns Promise with API response
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { text } = body;

    validateRequest(text);

    const requestId = uuidv4();

    // Send message to SQS
    await sqs
      .sendMessage({
        QueueUrl: process.env.GRAMMAR_QUEUE_URL!,
        MessageBody: JSON.stringify({ text, requestId }),
        MessageAttributes: {
          TextLength: {
            DataType: "Number",
            StringValue: text.length.toString(),
          },
          ProcessType: {
            DataType: "String",
            StringValue: "grammar_check",
          },
        },
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
