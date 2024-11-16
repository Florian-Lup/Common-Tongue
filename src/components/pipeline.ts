import * as dotenv from "dotenv";
dotenv.config();

import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

const chatModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4", // or 'gpt-3.5-turbo'
  temperature: 0.7,
});

// Prompt Templates
const copyEditorPrompt = PromptTemplate.fromTemplate(`
You are a **multilingual Copy Editor**. Recognize the language of the input text and correct any grammatical errors, punctuation, spelling, and syntax issues. Ensure consistency in style and accuracy of language. **Maintain the original meaning, tone, and style** of the text. Output the corrected text in the **same language**.

---

**Input Text:**

{inputText}
`);

const lineEditorPrompt = PromptTemplate.fromTemplate(`
You are a **multilingual Line Editor**. Improve the following text by enhancing sentence structure, flow, and style on a line-by-line basis. Aim to increase readability and clarity while **maintaining the author's original voice, meaning, tone, and style**. Do not introduce new content or significantly alter the original intent. Output the edited text in the **same language**.

---

**Input Text:**

{inputText}
`);

const proofreaderPrompt = PromptTemplate.fromTemplate(`
You are a **multilingual Proofreader**. Perform a final review of the following text to correct any remaining errors in grammar, punctuation, spelling, and typographical mistakes. Ensure the text is polished and ready for publication. **Preserve the original meaning, tone, and style**. Output the proofread text in the **same language**.

---

**Input Text:**

{inputText}
`);

// Chains for Each Agent
const copyEditorChain = copyEditorPrompt.pipe(chatModel);
const lineEditorChain = lineEditorPrompt.pipe(chatModel);
const proofreaderChain = proofreaderPrompt.pipe(chatModel);

// RunnableSequence Pipeline
const editingPipeline = RunnableSequence.from([
  async (inputText: string) => ({ inputText }), // Initial input formatting
  copyEditorChain,
  async (output: { text: string }) => ({ inputText: output.text }), // Prepare for next agent
  lineEditorChain,
  async (output: { text: string }) => ({ inputText: output.text }), // Prepare for next agent
  proofreaderChain,
  async (output: { text: string }) => output.text, // Final output
]);

// User Input
const userInputText = `Your text here`;

// Invoke the Pipeline
(async () => {
  try {
    const editedText = await editingPipeline.invoke(userInputText);
    console.log("Edited Text:\n", editedText);
  } catch (error) {
    console.error("Error during text editing:", error);
  }
})();
