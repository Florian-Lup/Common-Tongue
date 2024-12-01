import { SQSHandler, SQSRecord } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { grammarPipeline } from "../../../src/lib/LLMs/workflows/grammarPipeline";

// Types and interfaces for tracking grammar processing status and results
type ProcessingStage = "GRAMMAR_EDITING" | "SYNTAX_EDITING";

interface ProcessingStatus {
  status: "PROCESSING" | "COMPLETED" | "ERROR";
  progress?: {
    stage: ProcessingStage;
    percentage: number;
  };
  timestamp: number;
}

interface ProcessingResult {
  success: boolean;
  requestId: string;
  messageId?: string;
}

const dynamoDB = new DynamoDB.DocumentClient();

// Updates the processing status in DynamoDB for a given request
async function updateProgress(
  requestId: string,
  progress: ProcessingStatus
): Promise<void> {
  await dynamoDB
    .update({
      TableName: process.env.RESULTS_TABLE!,
      Key: { requestId },
      UpdateExpression:
        "SET #status = :status, progress = :progress, #ts = :timestamp",
      ExpressionAttributeNames: {
        "#status": "status",
        "#ts": "timestamp",
      },
      ExpressionAttributeValues: {
        ":status": progress.status,
        ":progress": progress.progress,
        ":timestamp": Date.now(),
      },
    })
    .promise();
}

// Processes a single SQS record containing text to be grammar checked
async function processRecord(record: SQSRecord): Promise<ProcessingResult> {
  const { text, requestId } = JSON.parse(record.body);

  try {
    // Set initial processing status in DynamoDB
    await updateProgress(requestId, {
      status: "PROCESSING",
      progress: { stage: "GRAMMAR_EDITING", percentage: 0 },
      timestamp: Date.now(),
    });

    // Process the text through the grammar pipeline
    const editedText = await grammarPipeline.invoke(text);

    // Update status to completed
    await updateProgress(requestId, {
      status: "COMPLETED",
      progress: { stage: "SYNTAX_EDITING", percentage: 100 },
      timestamp: Date.now(),
    });

    // Store the final edited text with TTL of 1 hour
    await dynamoDB
      .put({
        TableName: process.env.RESULTS_TABLE!,
        Item: {
          requestId,
          editedText,
          status: "COMPLETED",
          timestamp: Date.now(),
          messageId: record.messageId,
          ttl: Math.floor(Date.now() / 1000) + 3600,
        },
      })
      .promise();

    return { success: true, requestId, messageId: record.messageId };
  } catch (error) {
    // Update status to error if processing fails
    await updateProgress(requestId, {
      status: "ERROR",
      timestamp: Date.now(),
    });

    throw error;
  }
}

// Main Lambda handler for processing SQS messages
export const handler: SQSHandler = async (event) => {
  // Process all records in parallel and handle failures
  const results = await Promise.allSettled(event.Records.map(processRecord));

  // Return any failed messages for SQS retry
  const failed = results.filter(
    (r): r is PromiseRejectedResult => r.status === "rejected"
  );
  if (failed.length > 0) {
    console.error(`Failed to process ${failed.length} messages`);
  }

  return {
    batchItemFailures: failed.map((f) => ({
      itemIdentifier: f.reason?.messageId || "unknown",
    })),
  };
};
