import { VercelRequest, VercelResponse } from "@vercel/node";
import { ChatOpenAI } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { copyEditorChain } from "./agents/copyEditor";
import { lineEditorChain } from "./agents/lineEditor";
import { proofreaderChain } from "./agents/proofreader";

// LangChain Configuration
const chatModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4",
  temperature: 0.7,
});

// Editing Pipeline
const editingPipeline = RunnableSequence.from([
  async (inputText: string) => ({ inputText }),
  copyEditorChain(chatModel),
  async (output: { text: string }) => ({ inputText: output.text }),
  lineEditorChain(chatModel),
  async (output: { text: string }) => ({ inputText: output.text }),
  proofreaderChain(chatModel),
  async (output: { text: string }) => output.text,
]);

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
