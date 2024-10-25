import React, { useState, useRef, useEffect } from 'react';
import { FloatingMenu as TiptapFloatingMenu, Editor } from '@tiptap/react';
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg';
import './FloatingMenu.scss';

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
  const [inputValue, setInputValue] = useState('');
  const [hasError, setHasError] = useState(false);

  // Ref for the input field
  const inputRef = useRef<HTMLInputElement>(null);

  // Automatically focus the input when it appears
  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  const handleButtonClick = () => {
    setShowInput((prev) => {
      const newShowInput = !prev;
      if (newShowInput) {
        // Focus the input
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 0);
      } else {
        // Focus back on the editor
        editor.commands.focus();
      }
      return newShowInput;
    });
  };

  const handleSubmit = async () => {
    if (!inputValue.trim()) {
      setHasError(true);
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
      const { to, empty, head } = editor.state.selection;
      const position = empty ? head : to;

      // Send the prompt to the API
      const response = await fetch('/api/contentWriter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: { contentRequest: inputValue },
        }),
      });

      const data = await response.json();

      if (response.ok && data.newContent) {
        setInputValue('');
        setShowInput(false);
        // Start the typewriter effect without focusing the editor
        typeWriterEffect(editor, position, data.newContent);
      } else {
        console.error('API Error:', data.error || 'Unknown error');
        setHasError(true);
        setTimeout(() => setHasError(false), 3000);
      }
    } catch (err) {
      console.error('Submission error:', err);
      setHasError(true);
      setTimeout(() => setHasError(false), 3000);
    } finally {
      setIsProcessing(false);
    }
  };

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
        editor.commands.setTextSelection(from + length);
        // Focus the editor after typing is complete
        editor.commands.focus();
      }
    }, 10);
  };

  return (
    <TiptapFloatingMenu
      editor={editor}
      tippyOptions={{
        duration: 100,
        placement: 'bottom-start',
        hideOnClick: false,
        interactive: true,
      }}
      className="floating-menu"
    >
      <div className="floating-menu-content">
        <button
          onClick={handleButtonClick}
          className={`floating-menu-button ${showInput ? 'active' : ''}`}
          aria-label="AI Writer"
          aria-pressed={showInput}
          disabled={isTyping || isProcessing}
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