/* Grammar service for handling text proofreading functionality */
import { post } from "aws-amplify/api";
import { GrammarAPIResponse } from "../../types/api";

/* Function to proofread the provided text using the grammar API */
export async function proofreadText(text: string): Promise<string> {
  try {
    /* Send a POST request to the grammar API with the text to be proofread */
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

    /* Parse the response body as GrammarAPIResponse */
    const responseData =
      (await response.body.json()) as unknown as GrammarAPIResponse;

    if (!responseData.editedText) {
      throw new Error("No edited text received from the API");
    }

    return responseData.editedText;
  } catch (error) {
    /* Handle errors and throw a new error with a descriptive message */
    throw error instanceof Error
      ? error
      : new Error("An unexpected error occurred while processing the text.");
  }
}
