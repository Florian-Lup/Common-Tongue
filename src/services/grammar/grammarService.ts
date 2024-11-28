/* Grammar service for handling text proofreading functionality */
import { post, get } from "aws-amplify/api";
import { GrammarAPIResponse } from "../../types/api";

const MAX_POLLING_ATTEMPTS = 120;

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
  const initialDelay = 1000; // Wait 1 second before first poll

  // Wait for initial processing to begin
  await new Promise((resolve) => setTimeout(resolve, initialDelay));

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

      // Exponential backoff with a maximum of 5 seconds
      const delay = Math.min(1000 * Math.pow(1.5, attempts), 5000);
      await new Promise((resolve) => setTimeout(resolve, delay));
      attempts++;
    } catch (error) {
      // Only log real errors, not 404s during initial processing
      if (!(error instanceof Response) || error.status !== 404) {
        console.error("Polling error:", error);
      }

      if (attempts >= MAX_POLLING_ATTEMPTS - 1) {
        throw new Error("Maximum polling attempts reached");
      }

      // Exponential backoff for errors too
      const delay = Math.min(1000 * Math.pow(1.5, attempts), 5000);
      await new Promise((resolve) => setTimeout(resolve, delay));
      attempts++;
    }
  }

  throw new Error("Processing timeout exceeded");
}
