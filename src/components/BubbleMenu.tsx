// CustomBubbleMenu.tsx
import React, { useState, useEffect } from 'react';
import { BubbleMenu, Editor } from '@tiptap/react';
import './BubbleMenu.scss';

interface CustomBubbleMenuProps {
  editor: Editor;
  isTyping: boolean;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>; // New prop
}

const CustomBubbleMenu: React.FC<CustomBubbleMenuProps> = ({
  editor,
  isTyping,
  setIsTyping,
  setIsProcessing, // Destructure the new prop
}) => {
  const [isFixing, setIsFixing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Define the processing color
  const processingColor = '#d3d3d3'; // Light gray

  const handleFixGrammar = async () => {
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, ' ');

    if (!selectedText) {
      return;
    }

    try {
      setIsFixing(true);
      setIsProcessing(true); // Set processing state
      setErrorMessage(null); // Reset any previous error messages

      // Apply Strikethrough to the selected text
      if (!editor.isActive('strike')) {
        editor.chain().focus().toggleStrike().run();
      }

      // Apply Processing Color to the selected text
      editor.chain().focus().setColor(processingColor).run();

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

        editor.commands.focus();

        // Remove Strikethrough and Processing Color before replacing text
        if (editor.isActive('strike')) {
          editor.chain().focus().toggleStrike().run();
        }

        if (editor.isActive({ color: processingColor })) {
          editor.chain().focus().unsetColor().run();
        }

        // Start the typewriter effect
        typeWriterEffect(editor, from, to, finalRevision);
      } else {
        console.error('Error fixing grammar:', data.error || data.details);
        setErrorMessage('An error occurred.');

        // Remove Strikethrough and Processing Color since the operation failed
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

      // Remove Strikethrough and Processing Color since the operation failed
      if (editor.isActive('strike')) {
        editor.chain().focus().toggleStrike().run();
      }

      if (editor.isActive({ color: processingColor })) {
        editor.chain().focus().unsetColor().run();
      }
    } finally {
      setIsFixing(false);
      setIsProcessing(false); // Unset processing state
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

  // Automatically dismiss error message after 3 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000); // Dismiss after 3 seconds

      return () => clearTimeout(timer); // Cleanup the timer on component unmount or when errorMessage changes
    }
  }, [errorMessage]);

  return (
    <>
      {isFixing || isTyping || errorMessage ? (
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
