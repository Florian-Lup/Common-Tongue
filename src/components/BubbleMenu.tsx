import React, { useState } from 'react';
import { BubbleMenu, Editor } from '@tiptap/react';
import SpinnerAtSelection from './SpinnerAtSelection';
import './BubbleMenu.scss';

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
  const [showBubbleMenu, setShowBubbleMenu] = useState(true);
  const [showSpinner, setShowSpinner] = useState(false);

  const handleFixGrammar = async () => {
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, ' ');

    if (!selectedText) {
      console.log('No text selected.');
      return;
    }

    console.log('Selected text:', selectedText);

    try {
      // Close the bubble menu
      setShowBubbleMenu(false);
      // Show the spinner
      setShowSpinner(true);

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
      }
    } catch (error) {
      console.error('Error fixing grammar:', error);
    } finally {
      // Hide the spinner
      setShowSpinner(false);
    }
  };

  // Updated typeWriterEffect function
  const typeWriterEffect = (
    editor: Editor,
    from: number,
    to: number,
    text: string
  ) => {
    setIsTyping(true);

    // Delete the selected range
    editor.chain().focus().deleteRange({ from, to }).run();

    let index = 0;
    const length = text.length;

    const insertNextChar = () => {
      if (index < length) {
        const char = text.charAt(index);
        editor.chain().focus().insertText(char).run();
        index++;
        setTimeout(insertNextChar, 25);
      } else {
        setIsTyping(false);
        // Set the cursor position after the inserted text
        editor.chain().focus().setTextSelection(from + length).run();
      }
    };

    insertNextChar();
  };

  return (
    <>
      {showBubbleMenu && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100, placement: 'bottom' }}
        >
          <div className="bubble-menu">
            <button onClick={handleFixGrammar} disabled={isTyping}>
              Fix Grammar
            </button>
          </div>
        </BubbleMenu>
      )}

      {/* Spinner at Selection */}
      {showSpinner && <SpinnerAtSelection editor={editor} />}
    </>
  );
};

export default CustomBubbleMenu;
