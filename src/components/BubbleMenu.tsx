import React, { useState } from 'react';
import { BubbleMenu, Editor } from '@tiptap/react';
import './BubbleMenu.scss'; // Ensure spinner styles and error message styles are added here

interface CustomBubbleMenuProps {
  editor: Editor;
  isTyping: boolean;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
}

const CustomBubbleMenu: React.FC<CustomBubbleMenuProps> = ({
  editor,
  isTyping,
  setIsTyping,
}) => {
  const [isFixing, setIsFixing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFixGrammar = async () => {
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, ' ');

    if (!selectedText) {
      console.log('No text selected.');
      return;
    }

    console.log('Selected text:', selectedText);

    try {
      setIsFixing(true);
      setErrorMessage(null); // Reset any previous error messages

      const response = await fetch('/api/fixGrammar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: { manuscript: selectedText },
          version: '^1.3',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const { finalRevision } = data;
        console.log('Final revision:', finalRevision);

        editor.commands.focus();

        // Start the typewriter effect
        typeWriterEffect(editor, from, to, finalRevision);
      } else {
        console.error('Error fixing grammar:', data.error || data.details);
        setErrorMessage('An error occurred while fixing grammar.');
      }
    } catch (error) {
      console.error('Error fixing grammar:', error);
      setErrorMessage('An error occurred while fixing grammar.');
    } finally {
      setIsFixing(false);
    }
  };

  // Typewriter effect function
  const typeWriterEffect = (
    editor: Editor,
    from: number,
    to: number,
    text: string
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
    }, 25);
  };

  return (
    <>
      {(isFixing || isTyping || errorMessage) ? (
        // Render spinner or error message when action is in progress or an error occurred
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100, placement: 'bottom' }}
        >
          <div className="bubble-menu">
            {errorMessage ? (
              <div className="error-message">{errorMessage}</div>
            ) : (
              <div className="spinner"></div>
            )}
          </div>
        </BubbleMenu>
      ) : (
        // Render the bubble menu when no action is in progress
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100, placement: 'bottom' }}
        >
          <div className="bubble-menu">
            <button onClick={handleFixGrammar} disabled={isFixing || isTyping}>
              Fix Grammar
            </button>
            {/* Other buttons can be added here */}
          </div>
        </BubbleMenu>
      )}
    </>
  );
};

export default CustomBubbleMenu;
