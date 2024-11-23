import { PromptTemplate } from "@langchain/core/prompts";

export const copyEditorPrompt = PromptTemplate.fromTemplate(`
Correct any grammatical errors, punctuation, spelling, and syntax issues in the **manuscript**. Output only the corrected text without additional formatting, markdowns, labels or prefixes. If the **manuscript** doesn't require any adjustments, rewrite it as it is.

---

**Manuscript:**

{inputText}
`);
