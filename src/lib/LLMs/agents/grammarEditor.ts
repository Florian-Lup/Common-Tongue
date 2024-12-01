import { ChatOpenAI } from "@langchain/openai";

// Initialize the grammar editor AI model
// This model focuses on basic grammatical corrections, punctuation, and spelling
export const grammarEditorModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4o",
  temperature: 0,
});
