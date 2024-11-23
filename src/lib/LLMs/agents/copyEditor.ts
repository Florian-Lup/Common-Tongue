import { ChatOpenAI } from "@langchain/openai";

export const copyEditorModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4o",
  temperature: 0,
});
