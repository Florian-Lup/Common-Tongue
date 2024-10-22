// components/CustomFloatingMenu.tsx
import React, { useState } from 'react';
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
  const [error, setError] = useState<string | null>(null);

  const handleButtonClick = () => {
    setShowInput((prev) => !prev);
  };

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Example action: Insert input text into the editor
      editor.chain().focus().insertContent(inputValue).run();

      // TODO: Replace the above line with actual AI processing logic if needed

      // Reset input after successful submission
      setInputValue('');
      setShowInput(false);
    } catch (err) {
      console.error('Submission error:', err);
      setError('Failed to process input.');
    } finally {
      setIsProcessing(false);
    }
  };

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
          className="floating-menu-button"
          aria-label="AI Writer"
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
            />
            <button
              onClick={handleSubmit}
              className="floating-menu-submit-button"
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
        {error && <div className="error-message">{error}</div>}
      </div>
    </TiptapFloatingMenu>
  );
};

export default CustomFloatingMenu;
