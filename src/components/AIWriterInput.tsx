// components/AIWriterInput.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@tiptap/react';
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg';
import './AIWriterInput.scss';

interface AIWriterInputProps {
  editor: Editor;
  insertionPosition: number;
  onClose: () => void;
  isProcessing: boolean;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  isTyping: boolean;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
}

const AIWriterInput: React.FC<AIWriterInputProps> = ({
  editor,
  insertionPosition,
  onClose,
  isProcessing,
  setIsProcessing,
  isTyping,
  setIsTyping,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [hasError, setHasError] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!inputValue.trim()) {
      setHasError(true);
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
        typeWriterEffect(editor, insertionPosition, data.newContent);
      } else {
        console.error('API Error:', data.error || 'Unknown error');
        setHasError(true);
        setTimeout(() => setHasError(false), 3000);
      }

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
      }
    }, 10);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
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
        disabled={isProcessing || isTyping}
        ref={inputRef}
      />
      <button
        onClick={handleSubmit}
        className={`ai-writer-submit-button ${hasError ? 'error' : ''}`}
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
      <button
        onClick={onClose}
        className="ai-writer-close-button"
        aria-label="Close"
        disabled={isProcessing || isTyping}
      >
        <svg className="icon">
          <use href={`${remixiconUrl}#ri-close-line`} />
        </svg>
      </button>
    </div>
  );
};

export default AIWriterInput;