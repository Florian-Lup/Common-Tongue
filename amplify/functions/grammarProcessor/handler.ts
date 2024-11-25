import { SQSHandler } from "aws-lambda";
import { grammarPipeline } from "../../../src/lib/LLMs/workflows/grammarPipeline";
import { DynamoDB } from "aws-sdk";

const dynamoDB = new DynamoDB.DocumentClient();

export const handler: SQSHandler = async (event) => {
  for (const record of event.Records) {
    const { text, requestId } = JSON.parse(record.body);

    try {
      const editedText = await grammarPipeline.invoke(text);

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
      console.error("Processing error:", error);

      // Store the error in DynamoDB
      await dynamoDB
        .put({
          TableName: process.env.RESULTS_TABLE!,
          Item: {
            requestId,
            error: error instanceof Error ? error.message : "Unknown error",
            status: "ERROR",
            timestamp: Date.now(),
          },
        })
        .promise();
    }
  }
};
