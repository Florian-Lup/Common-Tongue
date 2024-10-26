// agents/GrammarAgent.ts
import { Editor } from '@tiptap/react';

export const GrammarAgent = async (
  editor: Editor,
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>,
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const processingColor = '#d3d3d3'; // Light gray
  const { from, to } = editor.state.selection;
  const selectedText = editor.state.doc.textBetween(from, to, ' ');

  if (!selectedText) {
    alert('Please select some text to fix grammar.');
    return;
  }

  try {
    setIsProcessing(true);
    setErrorMessage(null);

    if (!editor.isActive('strike')) {
      editor.chain().focus().toggleStrike().run();
    }

    editor.chain().focus().setColor(processingColor).run();

    const response = await fetch('/api/fixGrammar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inputs: { manuscript: selectedText },
        version: '^1.2',
      }),
    });

    const data = await response.json();

    if (response.ok) {
      const { finalRevision } = data;

      editor.commands.focus();

      if (editor.isActive('strike')) {
        editor.chain().focus().toggleStrike().run();
      }

      if (editor.isActive({ color: processingColor })) {
        editor.chain().focus().unsetColor().run();
      }

      typeWriterEffect(editor, from, to, finalRevision, setIsTyping);
    } else {
      console.error('Error fixing grammar:', data.error || data.details);
      setErrorMessage('An error occurred.');

      if (editor.isActive('strike')) {
        editor.chain().focus().toggleStrike().run();
      }

      if (editor.isActive({ color: processingColor })) {
        editor.chain().focus().unsetColor().run();
      }
    }
  } catch (error) {
    console.error('Error fixing grammar:', error);
    setErrorMessage('An error occurred.');

    if (editor.isActive('strike')) {
      editor.chain().focus().toggleStrike().run();
    }

    if (editor.isActive({ color: processingColor })) {
      editor.chain().focus().unsetColor().run();
    }
  } finally {
    setIsProcessing(false);
  }
};

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
      // Set the cursor position after the inserted text
      editor.commands.setTextSelection(from + length);
    }
  }, 10); // Typewriter speed
};
