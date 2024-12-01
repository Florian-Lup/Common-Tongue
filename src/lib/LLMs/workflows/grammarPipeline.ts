import { RunnableSequence } from "@langchain/core/runnables";
import { grammarEditorModel } from "../agents/grammarEditor";
import { syntaxEditorModel } from "../agents/syntaxEditor";
import { grammarEditorPrompt } from "../prompts/grammarEditorPrompt";
import { syntaxEditorPrompt } from "../prompts/syntaxEditorPrompt";

// Create individual chains by combining prompts with their respective models
const grammarEditorChain = grammarEditorPrompt.pipe(grammarEditorModel);
const syntaxEditorChain = syntaxEditorPrompt.pipe(syntaxEditorModel);

// Create a sequential pipeline that:
// 1. Formats the input text
// 2. Runs grammar editing for basic corrections
// 3. Processes the output for syntax editing
// 4. Runs syntax editing for improved readability
// 5. Returns the final cleaned text
export const grammarPipeline = RunnableSequence.from([
  async (inputText: string) => ({ inputText }),
  grammarEditorChain,
  async (output: { text: string }) => ({ inputText: output.text }),
  syntaxEditorChain,
  async (output: { text: string }) => output.text,
]);
