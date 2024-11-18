import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

// Copy Editor
const copyEditorModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4",
  temperature: 0.3,
});

const copyEditorPrompt = PromptTemplate.fromTemplate(`
You are a **multilingual Copy Editor**. Recognize the language of the input text and correct any grammatical errors, punctuation, spelling, and syntax issues. Ensure consistency in style and accuracy of language. **Maintain the original meaning, tone, and style** of the text. Output the corrected text in the **same language**.

---

**Input Text:**

{inputText}
`);

const copyEditorChain = copyEditorPrompt.pipe(copyEditorModel);

// Line Editor
const lineEditorModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4",
  temperature: 0.7,
});

const lineEditorPrompt = PromptTemplate.fromTemplate(`
You are a **multilingual Line Editor**. Improve the following text by enhancing sentence structure, flow, and style on a line-by-line basis. Aim to increase readability and clarity while **maintaining the author's original voice, meaning, tone, and style**. Do not introduce new content or significantly alter the original intent. Output the edited text in the **same language**.

---

**Input Text:**

{inputText}
`);

const lineEditorChain = lineEditorPrompt.pipe(lineEditorModel);

// Proofreader
const proofreaderModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4",
  temperature: 0.1,
});

const proofreaderPrompt = PromptTemplate.fromTemplate(`
You are a **multilingual Proofreader**. Perform a final review of the following text to correct any remaining errors in grammar, punctuation, spelling, and typographical mistakes. Ensure the text is polished and ready for publication. **Preserve the original meaning, tone, and style**. 

Output only the corrected text without any additional labels, prefixes, or formatting.

---

**Input Text:**

{inputText}
`);

const proofreaderChain = proofreaderPrompt.pipe(proofreaderModel);

// Editing Pipeline
const editingPipeline = RunnableSequence.from([
  async (inputText: string) => ({ inputText }),
  copyEditorChain,
  async (output: { text: string }) => ({ inputText: output.text }),
  lineEditorChain,
  async (output: { text: string }) => ({ inputText: output.text }),
  proofreaderChain,
  async (output: { text: string }) => output.text,
]);

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { text } = body;

    const editedText = await editingPipeline.invoke(text);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({ editedText }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
