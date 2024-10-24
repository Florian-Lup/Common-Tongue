// components/CustomFloatingMenu.tsx
import React, { useState, useEffect, useRef } from 'react';
import { FloatingMenu as TiptapFloatingMenu, Editor } from '@tiptap/react';
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg';
import './FloatingMenu.scss';

interface CustomFloatingMenuProps {
  editor: Editor;
  isTyping: boolean;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
}

const CustomFloatingMenu: React.FC<CustomFloatingMenuProps> = ({
  editor,
  isTyping,
  setIsTyping,
  setIsProcessing,
}) => {
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
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
      const response = await fetch('/api/contentWriter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: { contentRequest: inputValue },
        }),
      });

      const data = await response.json();

      if (response.ok && data.newContent) {
        // Insert the generated content into the editor with typewriter effect
        typeWriterEffect(editor, data.newContent);
      } else {
        console.error('API Error:', data.error || 'Unknown error');
        // Optionally display an error message to the user
        setHasError(true);
        // Remove the error highlight after 3 seconds
        setTimeout(() => setHasError(false), 3000);
      }

      // Reset input after submission
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

  // Typewriter effect function
  const typeWriterEffect = (editor: Editor, text: string) => {
    setIsTyping(true);

    // Determine the current position in the editor to insert content
    const position = editor.state.selection.head;

    let index = 0;
    const length = text.length;

    const interval = setInterval(() => {
      if (index < length) {
        const char = text.charAt(index);
        editor.commands.insertContentAt(position + index, char);
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        // Set the cursor position after the inserted text
        editor.commands.setTextSelection(position + length);
      }
    }, 10); // Typewriter speed (in milliseconds)
  };

  // useEffect to handle focusing
  useEffect(() => {
    if (showInput) {
      // Focus the input field when it's shown
      inputRef.current?.focus();
    }
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
          disabled={isTyping || isProcessing} // Disable button during typing or processing
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
              disabled={isProcessing || isTyping}
              ref={inputRef}
            />
            <button
              onClick={handleSubmit}
              className={`floating-menu-submit-button ${hasError ? 'error' : ''}`}
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
