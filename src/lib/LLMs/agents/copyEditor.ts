import { ChatOpenAI } from "@langchain/openai";

export const copyEditorModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "o1-mini",
  temperature: 0,
});
