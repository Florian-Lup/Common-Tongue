import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";

const proofreaderPrompt = PromptTemplate.fromTemplate(`
You are a **multilingual Proofreader**. Perform a final review of the following text to correct any remaining errors in grammar, punctuation, spelling, and typographical mistakes. Ensure the text is polished and ready for publication. **Preserve the original meaning, tone, and style**. 

Output only the corrected text without any additional labels, prefixes, or formatting.

---

**Input Text:**

{inputText}
`);

export const proofreaderChain = (chatModel: ChatOpenAI) =>
  proofreaderPrompt.pipe(chatModel);
