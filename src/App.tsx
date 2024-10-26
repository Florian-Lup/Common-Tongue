// App.tsx
import React, { useState, useEffect, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import CharacterCount from '@tiptap/extension-character-count';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import EditorMarks from './components/EditorMarks';
import Focus from '@tiptap/extension-focus';
import EditorNodes from './components/EditorNodes';
import FixedMenu from './components/FixedMenu';
import { GrammarAgent } from './components/agents/GrammarAgent';
import { WritingAgent } from './components/agents/WritingAgent';

const App: React.FC = () => {
  const [isTyping, setIsTyping] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [showComposeInput, setShowComposeInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [hasError, setHasError] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight.configure({ multicolor: true }),
      CharacterCount.configure({ limit: 5000 }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          switch (node.type.name) {
            case 'paragraph':
              return 'Write something...';
            case 'heading':
              return 'What’s the title?';
            default:
              return '';
          }
        },
        emptyNodeClass: 'empty-node',
      }),
      Underline,
      TextStyle,
      Color,
      Focus.configure({
        className: 'has-focus', // Custom class for focused nodes
        mode: 'shallowest',
      }),
    ],
    editable: !isTyping,
    onUpdate: ({ editor }) => {
      setCharacterCount(editor.storage.characterCount.characters());
    },
  });

  const handleFixGrammar = () => {
    if (editor) {
      GrammarAgent(editor, setIsProcessing, setErrorMessage, setIsTyping);
    }
  };

  const handleComposeClick = () => {
    setShowComposeInput((prev) => !prev);
    setHasError(false);
    setInputValue('');
  };

  const handleComposeSubmit = () => {
    if (!editor) {
      setHasError(true);
      setTimeout(() => setHasError(false), 3000);
      return;
    }

    if (!inputValue.trim()) {
      setHasError(true);
      setTimeout(() => setHasError(false), 3000);
      return;
    }

    WritingAgent(editor, inputValue, setIsProcessing, setErrorMessage, setIsTyping);

    // Reset input after submission
    setInputValue('');
    setShowComposeInput(false);
  };

  // Focus the input field when it's shown
  useEffect(() => {
    if (showComposeInput) {
      inputRef.current?.focus();
    }
  }, [showComposeInput]);

  // Automatically dismiss error message after 3 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000); // Dismiss after 3 seconds

      return () => clearTimeout(timer); // Cleanup the timer on component unmount or when errorMessage changes
    }
  }, [errorMessage]);

  if (!editor) {
    return null;
  }

  return (
    <div className={`editor-container ${isProcessing ? 'processing' : ''}`}>
      <div className="editor">
        <FixedMenu
          onFixGrammar={handleFixGrammar}
          onCompose={handleComposeClick}
          isProcessing={isProcessing || isTyping}
        />
        {showComposeInput && (
          <div className="compose-input-container">
            <input
              type="text"
              className={`compose-input ${hasError ? 'error' : ''}`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Write about..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleComposeSubmit();
                }
              }}
              disabled={isProcessing || isTyping}
              ref={inputRef}
            />
            <button
              onClick={handleComposeSubmit}
              className={`compose-submit-button ${hasError ? 'error' : ''}`}
              aria-label="Submit"
              disabled={isProcessing || isTyping}
            >
              {isProcessing ? (
                <div className="spinner"></div>
              ) : (
                <svg className="icon">
                  <use href="path-to-your-icon#icon-name" />
                </svg>
              )}
            </button>
          </div>
        )}
        <EditorContent className="editor__content" editor={editor} spellCheck={false} />
        <div className="editor__footer">
          <div className="character-count">{characterCount} characters</div>
        </div>
        <EditorMarks editor={editor} />
        <EditorNodes editor={editor} />
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default App;
