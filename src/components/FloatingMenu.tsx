// components/CustomFloatingMenu.tsx
import React, { useState, useEffect, useRef } from 'react';
import { FloatingMenu as TiptapFloatingMenu, Editor } from '@tiptap/react';
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg'; 
import './FloatingMenu.scss';

interface CustomFloatingMenuProps {
  editor: Editor;
}

const CustomFloatingMenu: React.FC<CustomFloatingMenuProps> = ({ editor }) => {
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasError, setHasError] = useState(false); // State for error highlighting

  // Ref for the input field
  const inputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    setShowInput((prev) => !prev);
  };

  const handleSubmit = async () => {
    if (!inputValue.trim()) {
      setHasError(true);
      // Remove the error highlight after 5 seconds
      setTimeout(() => setHasError(false), 5000);
      return;
    }

    setIsProcessing(true);

    try {
      // Example action: Insert input text into the editor
      editor.chain().focus().insertContent(inputValue).run();

      // TODO: Replace the above line with actual AI processing logic if needed

      // Reset input after successful submission
      setInputValue('');
      setShowInput(false);
    } catch (err) {
      console.error('Submission error:', err);
      // If you want to handle other errors, you can set them here
      // setError('Failed to process input.');
    } finally {
      setIsProcessing(false);
    }
  };

  // useEffect to handle focusing
  useEffect(() => {
    if (showInput) {
      // Focus the input field when it's shown
      inputRef.current?.focus();
    }
    // When showInput is false, do not focus anything
  }, [showInput]);

  return (
    <TiptapFloatingMenu
      editor={editor}
      tippyOptions={{
        duration: 100,
        placement: 'bottom-start',
      }}
      className="floating-menu"
    >
      <div className="floating-menu-content">
        <button
          onClick={handleButtonClick}
          className={`floating-menu-button ${showInput ? 'active' : ''}`}
          aria-label="AI Writer"
          aria-pressed={showInput}
        >
          <svg className="icon">
            <use href={`${remixiconUrl}#ri-edit-fill`} />
          </svg>
          AI Writer
        </button>
        {showInput && (
          <div className="floating-menu-input-container">
            <input
              type="text"
              className="floating-menu-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter your prompt..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
              disabled={isProcessing}
              ref={inputRef} // Attach the ref to the input
              // autoFocus removed as useEffect handles focusing
            />
            <button
              onClick={handleSubmit}
              className={`floating-menu-submit-button ${hasError ? 'error' : ''}`}
              aria-label="Submit"
              disabled={isProcessing}
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
        {/* Removed the error message as per the requirement */}
      </div>
    </TiptapFloatingMenu>
  );
};

export default CustomFloatingMenu;
