import { ChatOpenAI } from "@langchain/openai";

// Initialize the copy editor AI model
// This model focuses on basic grammatical corrections, punctuation, and spelling
export const copyEditorModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4o", // Using GPT-4 for high-accuracy corrections
  temperature: 0, // Set to 0 for consistent, deterministic outputs
});
