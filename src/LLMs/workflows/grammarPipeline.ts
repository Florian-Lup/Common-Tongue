import { RunnableSequence } from "@langchain/core/runnables";
import { copyEditorModel } from "../agents/copyEditor";
import { lineEditorModel } from "../agents/lineEditor";
import { proofreaderModel } from "../agents/proofreader";
import { copyEditorPrompt } from "../prompts/copyEditorPrompt";
import { lineEditorPrompt } from "../prompts/lineEditorPrompt";
import { proofreaderPrompt } from "../prompts/proofreaderPrompt";

const copyEditorChain = copyEditorPrompt.pipe(copyEditorModel);
const lineEditorChain = lineEditorPrompt.pipe(lineEditorModel);
const proofreaderChain = proofreaderPrompt.pipe(proofreaderModel);

export const grammarPipeline = RunnableSequence.from([
  async (inputText: string) => ({ inputText }),
  copyEditorChain,
  async (output: { text: string }) => ({ inputText: output.text }),
  lineEditorChain,
  async (output: { text: string }) => ({ inputText: output.text }),
  proofreaderChain,
  async (output: { text: string }) => output.text,
]);
