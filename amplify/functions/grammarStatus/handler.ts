import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const dynamoDB = new DynamoDB.DocumentClient();

// CORS headers for API Gateway responses
const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": process.env.CORS_ORIGIN || "*",
  "Access-Control-Allow-Methods": "OPTIONS,GET",
  "Access-Control-Allow-Headers":
    "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
  "Access-Control-Allow-Credentials": "true",
};

// Lambda handler for checking grammar processing status
export const handler: APIGatewayProxyHandler = async (event) => {
  const requestId = event.pathParameters?.requestId;

  // Validate request parameters
  if (!requestId) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Missing requestId parameter",
        status: "ERROR",
      }),
    };
  }

  try {
    // Fetch processing status from DynamoDB
    const result = await dynamoDB
      .get({
        TableName: process.env.RESULTS_TABLE!,
        Key: { requestId },
      })
      .promise();

    // Return 202 if processing hasn't started yet
    if (!result.Item) {
      return {
        statusCode: 202,
        headers: corsHeaders,
        body: JSON.stringify({
          status: "PROCESSING",
          message: "Processing not yet started",
          requestId,
        }),
      };
    }

    // Return processing status and results if found
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result.Item),
    };
  } catch (error) {
    // Handle any errors during status check
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
        status: "ERROR",
        requestId,
      }),
    };
  }
};
