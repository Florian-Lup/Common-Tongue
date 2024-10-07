import React, { useState } from 'react';
import { BubbleMenu, Editor } from '@tiptap/react';
import SpinnerAtSelection from './SpinnerAtSelection';
import './BubbleMenu.scss';

interface CustomBubbleMenuProps {
  editor: Editor;
  isTyping: boolean;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  isProcessing: boolean;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
}

const CustomBubbleMenu: React.FC<CustomBubbleMenuProps> = ({
  editor,
  isTyping,
  setIsTyping,
  isProcessing,
  setIsProcessing,
}) => {
  const [showBubbleMenu, setShowBubbleMenu] = useState(true);

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
      // Show the spinner and disable the editor
      setIsProcessing(true);

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

        // Hide the spinner and re-enable the editor before the typewriter effect
        setIsProcessing(false);

        editor.commands.focus();

        // Start the typewriter effect
        typeWriterEffect(editor, from, to, finalRevision);
      } else {
        console.error('Error fixing grammar:', data.error || data.details);
        // Ensure the editor is re-enabled in case of error
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Error fixing grammar:', error);
      // Ensure the editor is re-enabled in case of error
      setIsProcessing(false);
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
      {showBubbleMenu && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100, placement: 'bottom' }}
        >
          <div className="bubble-menu">
            <button
              onClick={handleFixGrammar}
              disabled={isTyping || isProcessing}
            >
              Fix Grammar
            </button>
          </div>
        </BubbleMenu>
      )}

      {/* Spinner at Selection */}
      {isProcessing && <SpinnerAtSelection editor={editor} />}
    </>
  );
};

export default CustomBubbleMenu;
