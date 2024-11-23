import { ChatOpenAI } from "@langchain/openai";

export const lineEditorModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4o-mini",
  temperature: 0,
});
