/* Grammar service for handling text proofreading functionality */
import { post, get } from "aws-amplify/api";
import { GrammarAPIResponse } from "../../types/api";

const POLLING_INTERVAL = 2000; // 2 seconds
const MAX_POLLING_ATTEMPTS = 30; // 1 minute maximum

/* Function to proofread the provided text using the grammar API */
export async function proofreadText(text: string): Promise<string> {
  try {
    /* Initial request to start processing */
    const response = await post({
      apiName: "grammarapi",
      path: "/grammar",
      options: {
        body: { text },
        headers: {
          "Content-Type": "application/json",
        },
      },
    }).response;

    const initialData =
      (await response.body.json()) as unknown as GrammarAPIResponse;

    if (!initialData.requestId) {
      throw new Error("No request ID received from the API");
    }

    /* Poll for results */
    const result = await pollForResults(initialData.requestId);

    if (result.status === "ERROR") {
      throw new Error(result.error || "Processing failed");
    }

    if (!result.editedText) {
      throw new Error("No edited text received from the API");
    }

    return result.editedText;
  } catch (error) {
    console.error("Detailed error:", error);
    throw error instanceof Error
      ? error
      : new Error("An unexpected error occurred while processing the text");
  }
}

async function pollForResults(requestId: string): Promise<GrammarAPIResponse> {
  let attempts = 0;

  while (attempts < MAX_POLLING_ATTEMPTS) {
    try {
      const response = await get({
        apiName: "grammarapi",
        path: `/status/${requestId}`,
      }).response;

      const result =
        (await response.body.json()) as unknown as GrammarAPIResponse;

      if (result.status === "COMPLETED" || result.status === "ERROR") {
        return result;
      }

      await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL));
      attempts++;
    } catch {
      // Silent fail and retry
      if (attempts >= MAX_POLLING_ATTEMPTS - 1) {
        throw new Error("Maximum polling attempts reached");
      }

      await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL));
      attempts++;
    }
  }

  throw new Error("Processing timeout exceeded");
}
