// components/AIWriterInput.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@tiptap/react';
import './AIWriterInput.scss';

interface AIWriterInputProps {
  editor: Editor;
  insertionPosition: number | null;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  isProcessing: boolean;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
}

const AIWriterInput: React.FC<AIWriterInputProps> = ({
  editor,
  insertionPosition,
  setIsTyping,
  isProcessing,
  setIsProcessing,
  onClose,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [hasError, setHasError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async () => {
    if (!inputValue.trim()) {
      setHasError(true);
      setTimeout(() => setHasError(false), 3000);
      return;
    }

    if (!editor || insertionPosition === null) {
      setHasError(true);
      setTimeout(() => setHasError(false), 3000);
      return;
    }

    setIsProcessing(true);

    try {
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
        // Insert the generated content into the editor with a typewriter effect
        typeWriterEffect(editor, insertionPosition, data.newContent);
      } else {
        console.error('API Error:', data.error || 'Unknown error');
        setHasError(true);
        setTimeout(() => setHasError(false), 3000);
      }

      // Reset input after submission
      setInputValue('');
      onClose(); // Close the input component
    } catch (err) {
      console.error('Submission error:', err);
      setHasError(true);
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

  return (
    <div className="ai-writer-input-container">
      <div className="ai-writer-input">
        <input
          type="text"
          className={`ai-writer-input-field ${hasError ? 'error' : ''}`}
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
          className={`ai-writer-submit-button ${hasError ? 'error' : ''}`}
          aria-label="Submit"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <div className="spinner"></div>
          ) : (
            <svg className="icon">
              <use href="path-to-icons#icon-submit" />
            </svg>
          )}
        </button>
        <button
          onClick={onClose}
          className="ai-writer-cancel-button"
          disabled={isProcessing}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AIWriterInput;
