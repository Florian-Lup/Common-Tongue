import { SQSHandler } from "aws-lambda";
import { grammarPipeline } from "../../../src/lib/LLMs/workflows/grammarPipeline";
import { DynamoDB } from "aws-sdk";

const dynamoDB = new DynamoDB.DocumentClient();

export const handler: SQSHandler = async (event) => {
  const results = await Promise.allSettled(
    event.Records.map(async (record) => {
      const { text, requestId } = JSON.parse(record.body);

      try {
        await dynamoDB
          .put({
            TableName: process.env.RESULTS_TABLE!,
            Item: {
              requestId,
              status: "PROCESSING",
              timestamp: Date.now(),
              messageId: record.messageId,
            },
          })
          .promise();

        const editedText = await grammarPipeline.invoke(text);

        await dynamoDB
          .put({
            TableName: process.env.RESULTS_TABLE!,
            Item: {
              requestId,
              editedText,
              status: "COMPLETED",
              timestamp: Date.now(),
              messageId: record.messageId,
            },
          })
          .promise();

        return { success: true, requestId };
      } catch (error) {
        await dynamoDB
          .put({
            TableName: process.env.RESULTS_TABLE!,
            Item: {
              requestId,
              error: error instanceof Error ? error.message : "Unknown error",
              errorDetails: error instanceof Error ? error.stack : undefined,
              status: "ERROR",
              timestamp: Date.now(),
              messageId: record.messageId,
            },
          })
          .promise();

        throw error; // Let SQS know this message failed
      }
    })
  );

  // Log processing results
  const failed = results.filter((r) => r.status === "rejected");
  if (failed.length > 0) {
    console.error(`Failed to process ${failed.length} messages`);
  }
};
