/* Grammar service for handling text proofreading functionality */
import { post, get } from "aws-amplify/api";
import { GrammarAPIResponse } from "../../types/api";
import { ExponentialBackoff } from "../../utils/backoff";

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

    const rawResponse = await response.body.json();
    const initialData = rawResponse as unknown as GrammarAPIResponse;

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

export async function pollForResults(
  requestId: string,
  options = {
    maxAttempts: 30,
    initialDelay: 2000,
    maxDelay: 15000,
    backoffFactor: 1.5,
  }
): Promise<GrammarAPIResponse> {
  const backoff = new ExponentialBackoff(options);

  while (await backoff.shouldContinue()) {
    try {
      const response = await get({
        apiName: "grammarapi",
        path: `/status/${requestId}`,
      }).response;

      // Ensure proper type casting
      const rawResult = await response.body.json();
      const result = rawResult as unknown as GrammarAPIResponse;

      // Validate the response has required properties
      if (!result || typeof result !== "object") {
        throw new Error("Invalid response format");
      }

      if (result.status === "COMPLETED" || result.status === "ERROR") {
        return result;
      }

      await backoff.wait();
    } catch (error) {
      if (error instanceof Response && error.status === 404) {
        await backoff.wait();
        continue;
      }

      if (backoff.currentAttempt >= options.maxAttempts - 1) {
        throw new Error("Maximum polling attempts reached");
      }

      console.error(
        `Polling error (attempt ${backoff.currentAttempt + 1}):`,
        error
      );
      await backoff.wait();
    }
  }

  throw new Error("Processing timeout exceeded");
}
