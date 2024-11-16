import { VercelRequest, VercelResponse } from "@vercel/node";
import * as dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

dotenv.config();

const chatModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4o",
  temperature: 0.7,
});

// Prompt Templates
const copyEditorPrompt = PromptTemplate.fromTemplate(`
You are a **multilingual Copy Editor**. Recognize the language of the input text and correct any grammatical errors, punctuation, spelling, and syntax issues. Ensure consistency in style and accuracy of language. **Maintain the original meaning, tone, and style** of the text. Output the corrected text in the **same language**.

---

**Input Text:**

{inputText}
`);

const lineEditorPrompt = PromptTemplate.fromTemplate(`
You are a **multilingual Line Editor**. Improve the following text by enhancing sentence structure, flow, and style on a line-by-line basis. Aim to increase readability and clarity while **maintaining the author's original voice, meaning, tone, and style**. Do not introduce new content or significantly alter the original intent. Output the edited text in the **same language**.

---

**Input Text:**

{inputText}
`);

const proofreaderPrompt = PromptTemplate.fromTemplate(`
You are a **multilingual Proofreader**. Perform a final review of the following text to correct any remaining errors in grammar, punctuation, spelling, and typographical mistakes. Ensure the text is polished and ready for publication. **Preserve the original meaning, tone, and style**. 

Output only the corrected text without any additional labels, prefixes, or formatting.

---

**Input Text:**

{inputText}
`);

// Chains for Each Agent
const copyEditorChain = copyEditorPrompt.pipe(chatModel);
const lineEditorChain = lineEditorPrompt.pipe(chatModel);
const proofreaderChain = proofreaderPrompt.pipe(chatModel);

// RunnableSequence Pipeline
const editingPipeline = RunnableSequence.from([
  async (inputText: string) => ({ inputText }), // Initial input formatting
  copyEditorChain,
  async (output: { text: string }) => ({ inputText: output.text }), // Prepare for next agent
  lineEditorChain,
  async (output: { text: string }) => ({ inputText: output.text }), // Prepare for next agent
  proofreaderChain,
  async (output: { text: string }) => output.text, // Final output
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
