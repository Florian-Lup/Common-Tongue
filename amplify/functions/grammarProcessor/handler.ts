import { SQSHandler } from "aws-lambda";
import { grammarPipeline } from "../../../src/lib/LLMs/workflows/grammarPipeline";
import { DynamoDB } from "aws-sdk";

const dynamoDB = new DynamoDB.DocumentClient();

export const handler: SQSHandler = async (event) => {
  for (const record of event.Records) {
    const { text, requestId } = JSON.parse(record.body);

    try {
      console.log(`Processing requestId: ${requestId}`);

      // Invoke the grammar pipeline
      const editedText = await grammarPipeline.invoke(text);

      console.log(`Edited text: ${editedText}`);

      // Store the result in DynamoDB
      const params = {
        TableName: process.env.RESULTS_TABLE!,
        Item: {
          requestId,
          editedText,
          status: "COMPLETED",
          timestamp: Date.now(),
        },
      };
      console.log(`Writing to DynamoDB: ${JSON.stringify(params)}`);

      await dynamoDB.put(params).promise();

      console.log(`Successfully processed requestId: ${requestId}`);
    } catch (error) {
      console.error(`Processing error for requestId ${requestId}:`, error);

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
