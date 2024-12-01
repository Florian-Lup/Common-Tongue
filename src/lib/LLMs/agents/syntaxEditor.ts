import { ChatOpenAI } from "@langchain/openai";

// Initialize the syntax editor AI model
// This model focuses on improving readability and clarity at the sentence level
export const syntaxEditorModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4o",
  temperature: 0,
});
