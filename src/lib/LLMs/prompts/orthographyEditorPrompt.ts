import { PromptTemplate } from "@langchain/core/prompts";

// Define the prompt template for the orthography editor
// This prompt focuses on basic punctuation and spelling corrections
export const orthographyEditorPrompt = PromptTemplate.fromTemplate(`
Correct any punctuation and spelling errors in the **manuscript**. Provide only the corrected text, without any additional formatting, markdown, labels, or prefixes. If no corrections are needed, return the **manuscript** exactly as it is.

---

**Manuscript:**

{inputText}
`);
