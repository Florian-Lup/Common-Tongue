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
  const [error, setError] = useState<string | null>(null); // State for error handling
  const inputRef = useRef<HTMLInputElement>(null); // Ref for input field

  const handleAIWriterClick = () => {
    setShowInput((prev) => !prev); // Toggle input visibility
  };

  const handleInputSubmit = async () => {
    if (!inputValue.trim()) {
      setError('Input cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Example: Call your AI service here
      // Replace the following line with your actual AI integration logic
      const aiResponse = `AI response to: ${inputValue}`;

      // Insert the AI response into the editor
      editor.chain().focus().insertContent(aiResponse).run();

      // Reset input field
      setInputValue('');
      setShowInput(false);
    } catch (err) {
      setError('Failed to process your request.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
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
          onClick={handleAIWriterClick}
          className="floating-menu-button"
          aria-label="AI Writer"
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
            />
            <button
              onClick={handleInputSubmit}
              className="submit-button"
              disabled={isSubmitting}
              aria-label="Submit AI prompt"
            >
              <svg className="arrow-icon">
                <use href={`${remixiconUrl}#ri-arrow-right-line`} />
              </svg>
            </button>
            {error && <div className="error-message">{error}</div>}
          </div>
        )}
      </div>
    </TiptapFloatingMenu>
  );
};

export default CustomFloatingMenu;
