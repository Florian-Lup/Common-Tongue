// components/CustomFloatingMenu.tsx
import React, { useState, useRef, useEffect } from 'react';
import { FloatingMenu as TiptapFloatingMenu, Editor } from '@tiptap/react';
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg'; 
import './FloatingMenu.scss';

interface CustomFloatingMenuProps {
  editor: Editor;
}

const CustomFloatingMenu: React.FC<CustomFloatingMenuProps> = ({ editor }) => {
  const [showInput, setShowInput] = useState(false); // State to manage input visibility
  const [inputValue, setInputValue] = useState(''); // State to manage input value
  const [isSubmitting, setIsSubmitting] = useState(false); // State for processing
  const [hasError, setHasError] = useState(false); // State for error indication
  const inputRef = useRef<HTMLInputElement>(null); // Ref for input field

  const handleAIWriterClick = () => {
    setShowInput((prev) => !prev); // Toggle input visibility
  };

  const handleInputSubmit = async () => {
    if (!inputValue.trim()) {
      setHasError(true);
      // Reset the error state after 2 seconds
      setTimeout(() => setHasError(false), 2000);
      return;
    }

    setIsSubmitting(true);
    setHasError(false);

    try {
      // Example: Call your AI service here
      // Replace the following line with your actual AI integration logic
      const aiResponse = `AI response to: ${inputValue}`;

      // Insert the AI response into the editor
      editor.chain().focus().insertContent(aiResponse).run();

      // Reset input field
      setInputValue('');
      setShowInput(false); // Close the input field
    } catch (err) {
      console.error(err);
      // Optionally, handle submission errors here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseInput = () => {
    setShowInput(false);
    setInputValue('');
    setHasError(false);
    editor.commands.blur(); // Clear the editor's selection to hide the floating menu
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputSubmit();
    }
  };

  useEffect(() => {
    if (showInput) {
      inputRef.current?.focus();
    }
  }, [showInput]);

  // Handle clicks outside the floating menu
  const handleClickOutside = () => {
    if (showInput) {
      handleCloseInput();
    }
  };

  return (
    <TiptapFloatingMenu
      editor={editor}
      tippyOptions={{
        duration: 100,
        placement: 'bottom-start',
        interactive: true, // Allow interactions within the floating menu
        onClickOutside: handleClickOutside, // Handle clicks outside
      }}
      className="floating-menu"
    >
      <div className="floating-menu-content">
        <button
          onClick={handleAIWriterClick}
          className="floating-menu-button"
          aria-label={showInput ? "Close AI Writer" : "Open AI Writer"}
        >
          <svg className="icon">
            <use href={`${remixiconUrl}#ri-edit-fill`} />
          </svg>
          AI Writer
        </button>

        {showInput && (
          <div className="ai-input-container">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter your prompt..."
              className="ai-input-field"
              disabled={isSubmitting}
              onKeyDown={handleKeyDown}
              aria-label="AI Writer Prompt"
            />
            <button
              onClick={handleInputSubmit}
              className={`submit-button ${hasError ? 'error' : ''}`}
              disabled={isSubmitting}
              aria-label="Submit AI prompt"
            >
              {isSubmitting ? (
                <div className="spinner"></div>
              ) : (
                <svg className="arrow-icon">
                  <use href={`${remixiconUrl}#ri-arrow-right-line`} />
                </svg>
              )}
            </button>
            {/* Removed the 'X' close button */}
          </div>
        )}
      </div>
    </TiptapFloatingMenu>
  );
};

export default CustomFloatingMenu;
