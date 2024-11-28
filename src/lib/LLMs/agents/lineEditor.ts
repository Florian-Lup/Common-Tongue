import { ChatOpenAI } from "@langchain/openai";

// Initialize the line editor AI model
// This model focuses on improving readability and clarity at the sentence level
export const lineEditorModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4o-mini", // Using a lighter model for style improvements
  temperature: 0.1, // Set to 0 for consistent, deterministic outputs
});
