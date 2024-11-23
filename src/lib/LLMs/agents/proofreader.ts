import { ChatOpenAI } from "@langchain/openai";

// Initialize the proofreader AI model
// This model performs final review and polish of the text
export const proofreaderModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4o", // Using GPT-4 for high-accuracy final review
  temperature: 0, // Set to 0 for consistent, deterministic outputs
});
