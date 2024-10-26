// components/MenuBar.tsx
import React, { useState, useEffect, useRef } from 'react';
import type { Editor } from "@tiptap/react";
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg';
import './MenuBar.scss';

interface MenuBarProps {
  editor: Editor;
  isTyping: boolean;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  isProcessing: boolean;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
}

const MenuBar: React.FC<MenuBarProps> = ({
  editor,
  isTyping,
  setIsTyping,
  isProcessing,
  setIsProcessing,
}) => {
  // State for Fix Grammar
  const [isFixing, setIsFixing] = useState(false);
  const [grammarError, setGrammarError] = useState<string | null>(null);

  // States for AI Writer
  const [showInput, setShowInput] = useState(false);
  const [aiInputValue, setAiInputValue] = useState('');
  const [aiHasError, setAiHasError] = useState(false);
  const aiInputRef = useRef<HTMLInputElement>(null);
  const insertionPositionRef = useRef<number | null>(null);

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
        editor.commands.setTextSelection(from + length);
      }
    }, 10); // Typewriter speed
  };

  // Fix Grammar Handler
  const handleFixGrammar = async () => {
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, ' ');

    if (!selectedText) {
      return;
    }

    try {
      setIsFixing(true);
      setIsProcessing(true);
      setGrammarError(null);

      if (!editor.isActive('strike')) {
        editor.chain().focus().toggleStrike().run();
      }

      editor.chain().focus().setColor('#d3d3d3').run();

      const response = await fetch('/api/fixGrammar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: { manuscript: selectedText },
          version: '^1.2',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const { finalRevision } = data;

        editor.commands.focus();

        if (editor.isActive('strike')) {
          editor.chain().focus().toggleStrike().run();
        }

        if (editor.isActive({ color: '#d3d3d3' })) {
          editor.chain().focus().unsetColor().run();
        }

        typeWriterEffect(editor, from, finalRevision);
      } else {
        console.error('Error fixing grammar:', data.error || data.details);
        setGrammarError('An error occurred.');
        if (editor.isActive('strike')) {
          editor.chain().focus().toggleStrike().run();
        }
        if (editor.isActive({ color: '#d3d3d3' })) {
          editor.chain().focus().unsetColor().run();
        }
      }
    } catch (error) {
      console.error('Error fixing grammar:', error);
      setGrammarError('An error occurred.');
      if (editor.isActive('strike')) {
        editor.chain().focus().toggleStrike().run();
      }
      if (editor.isActive({ color: '#d3d3d3' })) {
        editor.chain().focus().unsetColor().run();
      }
    } finally {
      setIsFixing(false);
      setIsProcessing(false);
    }
  };

  // AI Writer Handlers
  const handleAiButtonClick = () => {
    setShowInput((prev) => {
      const newShowInput = !prev;
      if (!newShowInput) {
        // Reset input and error states when hiding the input field
        setAiInputValue('');
        setAiHasError(false);
      }
      return newShowInput;
    });
  };

  const handleAiSubmit = async () => {
    if (!aiInputValue.trim()) {
      setAiHasError(true);
      setTimeout(() => setAiHasError(false), 3000);
      return;
    }

    if (!editor) {
      setAiHasError(true);
      setTimeout(() => setAiHasError(false), 3000);
      return;
    }

    setIsProcessing(true);

    try {
      const { to, empty, head } = editor.state.selection;
      const position = empty ? head : to;
      insertionPositionRef.current = position;

      const response = await fetch('/api/contentWriter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: { contentRequest: aiInputValue },
          version: '^1.3',
        }),
      });

      const data = await response.json();

      if (response.ok && data.newContent) {
        typeWriterEffect(editor, position, data.newContent);
      } else {
        console.error('API Error:', data.error || 'Unknown error');
        setAiHasError(true);
        setTimeout(() => setAiHasError(false), 3000);
      }

      setAiInputValue('');
      setShowInput(false);
    } catch (err) {
      console.error('Submission error:', err);
      setAiHasError(true);
      setTimeout(() => setAiHasError(false), 3000);
    } finally {
      setIsProcessing(false);
    }
  };

  // Focus the AI input when it's shown
  useEffect(() => {
    if (showInput) {
      aiInputRef.current?.focus();
    }
  }, [showInput]);

  // Automatically dismiss error messages after 3 seconds
  useEffect(() => {
    if (grammarError) {
      const timer = setTimeout(() => {
        setGrammarError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [grammarError]);

  useEffect(() => {
    if (aiHasError) {
      const timer = setTimeout(() => {
        setAiHasError(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [aiHasError]);

  return (
    <div className="editor__header">
      <div className="menu-bar">
        {/* Existing MenuBar buttons (e.g., Bold, Italic, etc.) */}
        <button
          onClick={handleFixGrammar}
          className="menu-bar-button"
          disabled={isFixing || isTyping || isProcessing}
          title="Fix Grammar"
        >
          {isFixing || isProcessing ? (
            <div className="spinner"></div>
          ) : (
            <svg className="icon">
              <use href={`${remixiconUrl}#ri-eraser-fill`} />
            </svg>
          )}
        </button>

        <div className="divider"></div>

        <button
          onClick={handleAiButtonClick}
          className={`menu-bar-button ${showInput ? 'active' : ''}`}
          disabled={isTyping || isProcessing}
          title="AI Writer"
          aria-pressed={showInput}
        >
          <svg className="icon">
            <use href={`${remixiconUrl}#ri-edit-fill`} />
          </svg>
        </button>

        {showInput && (
          <div className="ai-input-container">
            <input
              type="text"
              className={`ai-input ${aiHasError ? 'error' : ''}`}
              value={aiInputValue}
              onChange={(e) => setAiInputValue(e.target.value)}
              placeholder="Write about..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAiSubmit();
                }
              }}
              disabled={isProcessing || isTyping}
              ref={aiInputRef}
            />
            <button
              onClick={handleAiSubmit}
              className={`ai-submit-button ${aiHasError ? 'error' : ''}`}
              disabled={isProcessing || isTyping}
              title="Submit"
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

        {/* Display grammar error if any */}
        {grammarError && <div className="error-message">{grammarError}</div>}
      </div>
    </div>
  );
};

export default MenuBar;
