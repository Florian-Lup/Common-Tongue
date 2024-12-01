import { PromptTemplate } from "@langchain/core/prompts";

// Define the prompt template for the syntax editor
// This prompt focuses on improving the flow and clarity of the text
export const syntaxEditorPrompt = PromptTemplate.fromTemplate(`
Correct any syntax errors in the **manuscript**. Provide only the corrected text, without any additional formatting, markdown, labels, or prefixes. If no corrections are needed, return the **manuscript** exactly as it is.

---

**Manuscript:**

{inputText}
`);
