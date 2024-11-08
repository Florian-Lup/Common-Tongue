import { Editor } from "@tiptap/react";

const processingColor = "#d3d3d3"; // Light gray

export const fixGrammar = async (
  editor: Editor,
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>,
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const CHARACTER_LIMIT = 700;
  const { from, to } = editor.state.selection;
  const selectedText = editor.state.doc.textBetween(from, to, " ");

  if (!selectedText) {
    setErrorMessage("Please select some text to proofread.");
    return;
  }

  if (selectedText.length > CHARACTER_LIMIT) {
    setErrorMessage(
      `Selected text exceeds the ${CHARACTER_LIMIT} character limit.`
    );
    return;
  }

  try {
    setIsProcessing(true);
    setErrorMessage(null);

    if (!editor.isActive("strike")) {
      editor.chain().focus().toggleStrike().run();
    }

    editor.chain().focus().setColor(processingColor).run();

    const response = await fetch("/api/fixGrammar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inputs: { manuscript: selectedText },
        version: "^1.5",
      }),
    });

    const data = await response.json();

    if (response.ok) {
      const { finalRevision } = data;

      editor.commands.focus();

      if (editor.isActive("strike")) {
        editor.chain().focus().toggleStrike().run();
      }

      if (editor.isActive({ color: processingColor })) {
        editor.chain().focus().unsetColor().run();
      }

      typeWriterEffect(editor, from, to, finalRevision, setIsTyping);
    } else {
      console.error("Error fixing grammar:", data.error || data.details);
      setErrorMessage("An error occurred while fixing grammar.");
    }
  } catch (error) {
    console.error("Error fixing grammar:", error);
    setErrorMessage("An unexpected error occurred.");
  } finally {
    setIsProcessing(false);

    if (editor.isActive("strike")) {
      editor.chain().focus().toggleStrike().run();
    }

    if (editor.isActive({ color: processingColor })) {
      editor.chain().focus().unsetColor().run();
    }
  }
};

// Typewriter effect function
const typeWriterEffect = (
  editor: Editor,
  from: number,
  to: number,
  text: string,
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setIsTyping(true);

  editor.commands.deleteRange({ from, to });

  let index = 0;
  const length = text.length;

  const interval = setInterval(() => {
    if (index < length) {
      const char = text.charAt(index);
      editor.commands.insertContentAt(from + index, char);
      index++;
    } else {
      clearInterval(interval);
      setIsTyping(false);
      editor.commands.setTextSelection(from + length);
    }
  }, 10); // Adjust typing speed here
};
