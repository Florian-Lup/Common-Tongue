import { ChatOpenAI } from "@langchain/openai";

// Initialize the orthography editor AI model
// This model focuses on basic punctuation and spelling corrections
export const orthographyEditorModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4o",
  temperature: 0,
});
