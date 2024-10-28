// CustomBubbleMenu.tsx
import React, { useState } from "react";
import { BubbleMenu, Editor } from "@tiptap/react";
import remixiconUrl from "remixicon/fonts/remixicon.symbol.svg"; // Ensure this import is correct
import "./BubbleMenu.scss";

interface CustomBubbleMenuProps {
  editor: Editor;
  isTyping: boolean;
  isProcessing: boolean;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>; // New Prop for Error Messages
}

const CustomBubbleMenu: React.FC<CustomBubbleMenuProps> = ({
  editor,
  isTyping,
  isProcessing,
  setIsTyping,
  setIsProcessing,
  setErrorMessage, // Destructure the new prop
}) => {
  const [isFixing, setIsFixing] = useState(false);
  const CHARACTER_LIMIT = 700; // Define the character limit

  // Function to handle grammar fixing
  const handleFixGrammar = async () => {
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, " ");

    if (!selectedText) {
      return; // No text selected
    }

    // Check if selected text exceeds the character limit
    if (selectedText.length > CHARACTER_LIMIT) {
      setErrorMessage(
        `Selected text exceeds the ${CHARACTER_LIMIT} character limit.`
      );
      return;
    }

    try {
      setIsFixing(true);
      setIsProcessing(true);
      setErrorMessage(null); // Clear any existing errors

      // Apply strikethrough to indicate processing
      if (!editor.isActive("strike")) {
        editor.chain().focus().toggleStrike().run();
      }

      // Add processing class to the editor container
      editor.setOptions({
        ...editor.options,
        extensions: [
          ...editor.options.extensions,
          {
            name: 'processing',
            addGlobalStyle() {
              return `
                .editor-container.processing ::selection {
                  background-color: rgba(255, 223, 186, 0.5); // Light orange background
                  color: inherit; // Keep the original text color
                }
              `;
            },
          },
        ],
      });

      // API Call to Fix Grammar
      const response = await fetch("/api/fixGrammar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputs: { manuscript: selectedText },
          version: "^1.2",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const { finalRevision } = data;

        editor.commands.focus();

        // Remove strikethrough after processing
        if (editor.isActive("strike")) {
          editor.chain().focus().toggleStrike().run();
        }

        // Insert the revised text with a typewriter effect
        typeWriterEffect(editor, from, to, finalRevision);
      } else {
        console.error("Error fixing grammar:", data.error || data.details);
        setErrorMessage("An error occurred while fixing grammar.");

        // Remove strikethrough if API call fails
        if (editor.isActive("strike")) {
          editor.chain().focus().toggleStrike().run();
        }
      }
    } catch (error) {
      console.error("Error fixing grammar:", error);
      setErrorMessage("An unexpected error occurred.");

      // Remove strikethrough if an exception occurs
      if (editor.isActive("strike")) {
        editor.chain().focus().toggleStrike().run();
      }
    } finally {
      // Remove processing class from editor container
      editor.setOptions({
        ...editor.options,
        extensions: [
          ...editor.options.extensions.filter(ext => ext.name !== 'processing'),
        ],
      });

      setIsFixing(false);
      setIsProcessing(false);
    }
  };

  // Typewriter effect function to insert text character by character
  const typeWriterEffect = (
    editor: Editor,
    from: number,
    to: number,
    text: string
  ) => {
    setIsTyping(true);

    // Remove the original selected text
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
    }, 10); // Adjust typing speed here (milliseconds per character)
  };

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100, placement: "bottom" }}
    >
      <div className="bubble-menu">
        <button
          onClick={handleFixGrammar}
          disabled={isFixing || isTyping || isProcessing}
          className="bubble-button"
          aria-label="Fix Grammar" // Accessibility for screen readers
        >
          {isFixing || isProcessing || isTyping ? (
            <div className="spinner" aria-label="Loading"></div>
          ) : (
            <svg className="icon" aria-hidden="true">
              <use href={`${remixiconUrl}#ri-eraser-fill`} />
            </svg>
          )}
          Fix Grammar
        </button>
        {/* Additional buttons can be added here */}
      </div>
      {/* Removed local error message rendering */}
    </BubbleMenu>
  );
};

export default CustomBubbleMenu;