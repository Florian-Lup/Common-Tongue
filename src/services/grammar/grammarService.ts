import { post } from "aws-amplify/api";
import { GrammarAPIResponse } from "../../types/api";

export async function proofreadText(text: string): Promise<string> {
  try {
    const response = await post({
      apiName: "grammarAPI",
      path: "grammar",
      options: {
        body: { text },
        headers: {
          "Content-Type": "application/json",
        },
      },
    }).response;

    const responseData =
      (await response.body.json()) as unknown as GrammarAPIResponse;

    if (!responseData.editedText) {
      throw new Error("No edited text received from the API");
    }

    return responseData.editedText;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("An unexpected error occurred while processing the text.");
  }
}
