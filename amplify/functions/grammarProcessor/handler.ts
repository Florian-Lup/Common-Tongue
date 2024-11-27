import { SQSHandler } from "aws-lambda";
import { grammarPipeline } from "../../../src/lib/LLMs/workflows/grammarPipeline";
import { DynamoDB } from "aws-sdk";

const dynamoDB = new DynamoDB.DocumentClient();

export const handler: SQSHandler = async (event) => {
  for (const record of event.Records) {
    const { text, requestId } = JSON.parse(record.body);

    try {
      console.log(
        `Processing requestId: ${requestId}, text length: ${text.length}`
      );

      // Store initial processing status
      await dynamoDB
        .put({
          TableName: process.env.RESULTS_TABLE!,
          Item: {
            requestId,
            status: "PROCESSING",
            timestamp: Date.now(),
          },
        })
        .promise();

      // Invoke the grammar pipeline
      const editedText = await grammarPipeline.invoke(text);

      console.log(`Successfully processed text for requestId: ${requestId}`);

      // Store the result in DynamoDB
      await dynamoDB
        .put({
          TableName: process.env.RESULTS_TABLE!,
          Item: {
            requestId,
            editedText,
            status: "COMPLETED",
            timestamp: Date.now(),
          },
        })
        .promise();
    } catch (error) {
      console.error(`Error details for requestId ${requestId}:`, {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });

      // Store the error in DynamoDB with more detail
      await dynamoDB
        .put({
          TableName: process.env.RESULTS_TABLE!,
          Item: {
            requestId,
            error: error instanceof Error ? error.message : "Unknown error",
            errorDetails: error instanceof Error ? error.stack : undefined,
            status: "ERROR",
            timestamp: Date.now(),
          },
        })
        .promise();
    }
  }
};
