import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";

const lineEditorPrompt = PromptTemplate.fromTemplate(`
You are a **multilingual Line Editor**. Improve the following text by enhancing sentence structure, flow, and style on a line-by-line basis. Aim to increase readability and clarity while **maintaining the author's original voice, meaning, tone, and style**. Do not introduce new content or significantly alter the original intent. Output the edited text in the **same language**.

---

**Input Text:**

{inputText}
`);

export const lineEditorChain = (chatModel: ChatOpenAI) =>
  lineEditorPrompt.pipe(chatModel);
