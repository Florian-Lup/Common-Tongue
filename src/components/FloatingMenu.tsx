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
  const [hasError, setHasError] = useState(false);

  // Ref for the input field
  const inputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    setShowInput((prev) => {
      const newShowInput = !prev;
      if (!newShowInput) {
        // Reset input and error states when hiding the input field
        setInputValue('');
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

    setIsProcessing(true);

    try {
      const response = await fetch('/api/ai-writer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: { contentRequest: inputValue },
        }),
      });

      const data = await response.json();

      if (response.ok && data.newContent) {
        // Insert the generated content into the editor
        editor.chain().focus().insertContent(data.newContent).run();
      } else {
        console.error('API Error:', data.error || 'Unknown error');
        // Optionally display an error message to the user
        setHasError(true);
        // Remove the error highlight after 3 seconds
        setTimeout(() => setHasError(false), 3000);
      }

      // Reset input after successful submission
      setInputValue('');
      setShowInput(false);
    } catch (err) {
      console.error('Submission error:', err);
      setHasError(true);
      // Remove the error highlight after 3 seconds
      setTimeout(() => setHasError(false), 3000);
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
              className={`floating-menu-input ${hasError ? 'error' : ''}`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter your prompt..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
              disabled={isProcessing}
              ref={inputRef}
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
      </div>
    </TiptapFloatingMenu>
  );
};

export default CustomFloatingMenu;
