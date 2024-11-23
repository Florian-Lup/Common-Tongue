import { PromptTemplate } from "@langchain/core/prompts";

export const copyEditorPrompt = PromptTemplate.fromTemplate(`
You are a **multilingual Copy Editor**. Recognize the language of the input text and correct any grammatical errors, punctuation, spelling, and syntax issues. Ensure consistency in style and accuracy of language. **Maintain the original meaning, tone, and style** of the text. Output the corrected text in the **same language**.

---

**Input Text:**

{inputText}
`);
