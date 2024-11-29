import { SQSHandler, SQSRecord } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { grammarPipeline } from "../../../src/lib/LLMs/workflows/grammarPipeline";

type ProcessingStage = "COPY_EDITING" | "LINE_EDITING" | "PROOFREADING";

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

async function processRecord(record: SQSRecord): Promise<ProcessingResult> {
  const { text, requestId } = JSON.parse(record.body);

  try {
    // Initial status
    await updateProgress(requestId, {
      status: "PROCESSING",
      progress: { stage: "COPY_EDITING", percentage: 0 },
      timestamp: Date.now(),
    });

    // Process text
    const editedText = await grammarPipeline.invoke(text);

    // Final status
    await updateProgress(requestId, {
      status: "COMPLETED",
      progress: { stage: "PROOFREADING", percentage: 100 },
      timestamp: Date.now(),
    });

    // Store the edited text
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
    await updateProgress(requestId, {
      status: "ERROR",
      timestamp: Date.now(),
    });

    throw error;
  }
}

export const handler: SQSHandler = async (event) => {
  const results = await Promise.allSettled(event.Records.map(processRecord));

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
