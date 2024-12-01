import { PromptTemplate } from "@langchain/core/prompts";

// Define the prompt template for the grammar editor
// This prompt focuses on technical corrections without changing the content's meaning
export const grammarEditorPrompt = PromptTemplate.fromTemplate(`
Correct any grammatical errors in the **manuscript**. Provide only the corrected text, without any additional formatting, markdown, labels, or prefixes. If no corrections are needed, return the **manuscript** exactly as it is.

---

**Manuscript:**

{inputText}
`);
