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
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

const CustomBubbleMenu: React.FC<CustomBubbleMenuProps> = ({
  editor,
  isTyping,
  isProcessing,
  setIsTyping,
  setIsProcessing,
  setErrorMessage,
}) => {
  const [isFixing, setIsFixing] = useState(false);
  const CHARACTER_LIMIT = 700;

  // Function to handle grammar fixing
  const handleFixGrammar = async () => {
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, " ");

    if (!selectedText) return; // No text selected

    // Check for character limit
    if (selectedText.length > CHARACTER_LIMIT) {
      setErrorMessage(
        `Selected text exceeds the ${CHARACTER_LIMIT} character limit.`
      );
      return;
    }

    try {
      setIsFixing(true);
      setIsProcessing(true);
      setErrorMessage(null); // Clear existing errors

      // Apply strikethrough to indicate processing
      if (!editor.isActive("strike")) {
        editor.chain().focus().toggleStrike().run();
      }

      // API call to fix grammar
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

        // Insert revised text with typewriter effect
        typeWriterEffect(editor, from, to, finalRevision);
      } else {
        console.error("Error fixing grammar:", data.error || data.details);
        setErrorMessage("An error occurred while fixing grammar.");
      }
    } catch (error) {
      console.error("Error fixing grammar:", error);
      setErrorMessage("An unexpected error occurred.");
    } finally {
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
    editor.commands.deleteRange({ from, to }); // Remove the original selected text

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
        editor.commands.setTextSelection(from + length); // Set cursor position
      }
    }, 10); // Adjust typing speed here
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
          aria-label="Fix Grammar"
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
      </div>
    </BubbleMenu>
  );
};

export default CustomBubbleMenu;