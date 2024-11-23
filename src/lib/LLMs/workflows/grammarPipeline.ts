import { RunnableSequence } from "@langchain/core/runnables";
import { copyEditorModel } from "../agents/copyEditor";
import { lineEditorModel } from "../agents/lineEditor";
import { proofreaderModel } from "../agents/proofreader";
import { copyEditorPrompt } from "../prompts/copyEditorPrompt";
import { lineEditorPrompt } from "../prompts/lineEditorPrompt";
import { proofreaderPrompt } from "../prompts/proofreaderPrompt";

// Create individual chains by combining prompts with their respective models
const copyEditorChain = copyEditorPrompt.pipe(copyEditorModel);
const lineEditorChain = lineEditorPrompt.pipe(lineEditorModel);
const proofreaderChain = proofreaderPrompt.pipe(proofreaderModel);

// Create a sequential pipeline that:
// 1. Formats the input text
// 2. Runs copy editing for basic corrections
// 3. Processes the output for line editing
// 4. Runs line editing for improved readability
// 5. Processes the output for proofreading
// 6. Runs final proofreading
// 7. Returns the final cleaned text
export const grammarPipeline = RunnableSequence.from([
  async (inputText: string) => ({ inputText }),
  copyEditorChain,
  async (output: { text: string }) => ({ inputText: output.text }),
  lineEditorChain,
  async (output: { text: string }) => ({ inputText: output.text }),
  proofreaderChain,
  async (output: { text: string }) => output.text,
]);
