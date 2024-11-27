import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const dynamoDB = new DynamoDB.DocumentClient();

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": process.env.CORS_ORIGIN || "*",
  "Access-Control-Allow-Methods": "OPTIONS,GET",
  "Access-Control-Allow-Headers":
    "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
  "Access-Control-Allow-Credentials": "true",
};

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  const requestId = event.pathParameters?.requestId;

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
    console.log(`Fetching result for requestId: ${requestId}`);

    const result = await dynamoDB
      .get({
        TableName: process.env.RESULTS_TABLE!,
        Key: { requestId },
      })
      .promise();

    console.log(`DynamoDB get result:`, JSON.stringify(result, null, 2));

    if (!result.Item) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({
          error: "Result not found",
          status: "ERROR",
          requestId,
        }),
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result.Item),
    };
  } catch (error) {
    console.error("Error details:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

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
