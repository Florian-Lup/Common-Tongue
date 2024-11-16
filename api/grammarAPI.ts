import { VercelRequest, VercelResponse } from "@vercel/node";
import { editingPipeline } from "./grammarWorkflow";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text } = request.body;
    const editedText = await editingPipeline.invoke(text);
    return response.status(200).json({ editedText });
  } catch (error) {
    console.error("Error:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}
