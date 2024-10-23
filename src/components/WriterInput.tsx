// components/WriterInput.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@tiptap/react';
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg';
import './WriterInput.scss';

interface WriterInputProps {
  editor: Editor;
  onClose: () => void; // Function to close the input component
}

const WriterInput: React.FC<WriterInputProps> = ({ editor, onClose }) => {
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
      // Reset input after successful submission
      setInputValue('');
      onClose(); // Close the input component
    } catch (err) {
      console.error('Submission error:', err);
      // Optionally handle other errors here
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    // Focus the input field when the component is mounted
    inputRef.current?.focus();
  }, []);

  return (
    <div className="writer-input-container">
      <input
        type="text"
        className={`writer-input ${hasError ? 'error' : ''}`}
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
        className={`writer-submit-button ${hasError ? 'error' : ''}`}
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
      {/* Optionally display an error message */}
      {hasError && <div className="writer-error-message">Please enter a prompt.</div>}
    </div>
  );
};

export default WriterInput;
