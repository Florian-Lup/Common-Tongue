import * as dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { copyEditorChain } from "./agents/copyEditor";
import { lineEditorChain } from "./agents/lineEditor";
import { proofreaderChain } from "./agents/proofreader";

dotenv.config();

// LangChain Configuration
export const chatModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4",
  temperature: 0.7,
});

// Clean up function to remove any prefixes or labels
const cleanOutput = (text: string): string => {
  let cleanText = text;
  cleanText = cleanText.replace(/^\*\*Proofread Text:\*\*\s*/i, "");
  cleanText = cleanText.replace(/^Proofread Text:\s*/i, "");
  return cleanText;
};

// Editing Pipeline
export const editingPipeline = RunnableSequence.from([
  async (inputText: string) => ({ inputText }),
  copyEditorChain,
  async (output: { text: string }) => ({ inputText: output.text }),
  lineEditorChain,
  async (output: { text: string }) => ({ inputText: output.text }),
  proofreaderChain,
  async (output: { text: string }) => cleanOutput(output.text),
]);
