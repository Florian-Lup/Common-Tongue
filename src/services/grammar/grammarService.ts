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
      apiName: "grammarAPI" /* Name of the API */,
      path: "grammar" /* Path for the grammar endpoint */,
      options: {
        body: { text } /* Request body containing the text */,
        headers: {
          "Content-Type": "application/json" /* Set content type to JSON */,
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
    /* Handle errors and throw a new error with a descriptive message */
    throw error instanceof Error
      ? error
      : new Error("An unexpected error occurred while processing the text.");
  }
}

async function pollForResults(requestId: string): Promise<GrammarAPIResponse> {
  let attempts = 0;

  while (attempts < MAX_POLLING_ATTEMPTS) {
    const response = await get({
      apiName: "grammarAPI",
      path: `status?requestId=${requestId}`,
    }).response;

    const result =
      (await response.body.json()) as unknown as GrammarAPIResponse;

    if (result.status === "COMPLETED" || result.status === "ERROR") {
      return result;
    }

    await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL));
    attempts++;
  }

  throw new Error("Processing timeout exceeded");
}
