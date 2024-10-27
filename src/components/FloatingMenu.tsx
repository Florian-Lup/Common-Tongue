// components/CustomFloatingMenu.tsx
import React, { useState, useEffect, useRef } from "react";
import { FloatingMenu as TiptapFloatingMenu, Editor } from "@tiptap/react";
import remixiconUrl from "remixicon/fonts/remixicon.symbol.svg";
import "./FloatingMenu.scss";

interface CustomFloatingMenuProps {
  editor: Editor;
  isTyping: boolean;
  isProcessing: boolean;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
}

const CustomFloatingMenu: React.FC<CustomFloatingMenuProps> = ({
  editor,
  isTyping,
  isProcessing,
  setIsTyping,
  setIsProcessing,
}) => {
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [hasError, setHasError] = useState(false);

  // Ref for the input field
  const inputRef = useRef<HTMLInputElement>(null);

  // To store the insertion position
  const insertionPositionRef = useRef<number | null>(null);

  // Ref to store the previous value of showInput
  const prevShowInputRef = useRef<boolean>(false);

  const handleButtonClick = () => {
    setShowInput((prev) => {
      const newShowInput = !prev;
      if (!newShowInput) {
        // Reset input and error states when hiding the input field
        setInputValue("");
        setHasError(false);
      }
      return newShowInput;
    });
  };

  const handleSubmit = async () => {
    if (!inputValue.trim()) {
      setHasError(true);
      // Remove the error highlight after 3 seconds
      setTimeout(() => setHasError(false), 3000);
      return;
    }

    if (!editor) {
      setHasError(true);
      setTimeout(() => setHasError(false), 3000);
      return;
    }

    setIsProcessing(true);

    try {
      // Capture the current selection position
      const { to, empty, head } = editor.state.selection;
      const position = empty ? head : to; // Insert at cursor if selection is empty, else at end of selection

      insertionPositionRef.current = position;

      // Send the prompt to the API
      const response = await fetch("/api/contentWriter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputs: { contentRequest: inputValue },
          version: "^1.3",
        }),
      });

      const data = await response.json();

      if (response.ok && data.newContent) {
        // Insert the generated content into the editor with typewriter effect
        typeWriterEffect(editor, position, data.newContent);
      } else {
        console.error("API Error:", data.error || "Unknown error");
        setHasError(true);
        // Remove the error highlight after 3 seconds
        setTimeout(() => setHasError(false), 3000);
      }

      // Reset input after submission
      setInputValue("");
      setShowInput(false);
    } catch (err) {
      console.error("Submission error:", err);
      setHasError(true);
      // Remove the error highlight after 3 seconds
      setTimeout(() => setHasError(false), 3000);
    } finally {
      setIsProcessing(false);
    }
  };

  // Typewriter effect function
  const typeWriterEffect = (editor: Editor, from: number, text: string) => {
    setIsTyping(true);

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
    }, 10); // Typewriter speed (in milliseconds)
  };

  // useEffect to handle focusing when the input field is shown
  useEffect(() => {
    if (showInput) {
      // Focus the input field when it's shown
      inputRef.current?.focus();
    }
  }, [showInput]);

  // useEffect to handle focusing back to the editor when AI Writer becomes inactive
  useEffect(() => {
    if (prevShowInputRef.current && !showInput && !isProcessing && !isTyping) {
      editor.commands.focus();
    }
    prevShowInputRef.current = showInput;
  }, [showInput, isProcessing, isTyping, editor]);

  return (
    <TiptapFloatingMenu
      editor={editor}
      tippyOptions={{
        duration: 100,
        placement: "bottom-start",
      }}
      className="floating-menu"
    >
      <div className="floating-menu-content">
        <button
          onClick={handleButtonClick}
          className={`floating-menu-button ${showInput ? "active" : ""}`}
          aria-label="AI Writer"
          aria-pressed={showInput}
          disabled={isTyping || isProcessing}
        >
          <svg className="icon">
            <use href={`${remixiconUrl}#ri-edit-fill`} />
          </svg>
        </button>
        {showInput && (
          <div className="floating-menu-input-container">
            <input
              type="text"
              className={`floating-menu-input ${hasError ? "error" : ""}`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Write about..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
              disabled={isProcessing || isTyping}
              ref={inputRef}
            />
            <button
              onClick={handleSubmit}
              className={`floating-menu-submit-button ${
                hasError ? "error" : ""
              }`}
              aria-label="Submit"
              disabled={isProcessing || isTyping}
            >
              {isProcessing ? (
                <div className="spinner"></div>
              ) : (
                <svg className="icon">
                  <use href={`${remixiconUrl}#ri-arrow-right-line`} />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>
    </TiptapFloatingMenu>
  );
};

export default CustomFloatingMenu;
