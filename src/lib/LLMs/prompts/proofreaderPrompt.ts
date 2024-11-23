import { PromptTemplate } from "@langchain/core/prompts";

// Define the prompt template for the proofreader
// This prompt focuses on final polish and ensuring publication-ready quality
export const proofreaderPrompt = PromptTemplate.fromTemplate(`
Perform a final review of the **manuscript** to correct any remaining errors in grammar, punctuation, spelling, typographical mistakes and clarity. Ensure the text is polished and ready for publication. Output only the corrected text without additional formatting, markdowns, labels or prefixes. If the **manuscript** doesn't require any adjustments, rewrite it as it is.

---

**Manuscript:**

{inputText}
`);
