// components/CustomFloatingMenu.tsx
import React, { useState, useEffect, useRef } from 'react';
import { FloatingMenu as TiptapFloatingMenu, Editor } from '@tiptap/react';
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg';
import './FloatingMenu.scss';
import { nanoid } from 'nanoid'; // Import nanoid for unique IDs

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

  // To store the placeholder ID and position
  const placeholderIdRef = useRef<string | null>(null);
  const insertionPositionRef = useRef<number | null>(null);

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

    if (!editor) {
      setHasError(true);
      setTimeout(() => setHasError(false), 3000);
      return;
    }

    setIsProcessing(true);

    try {
      // Capture the current selection position
      const position = editor.state.selection.head; // Current cursor position

      // Generate a unique ID for the placeholder
      const placeholderId = `placeholder-${nanoid()}`;
      placeholderIdRef.current = placeholderId;
      insertionPositionRef.current = position;

      // Insert a placeholder node at the current position
      editor.chain()
        .focus()
        .insertContentAt(position, `<span id="${placeholderId}" class="placeholder">Generating content...</span>`)
        .run();

      // Optionally, you can style the placeholder via CSS to indicate it's a placeholder

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
        // Replace the placeholder with the generated content
        replacePlaceholderWithContent(placeholderId, data.newContent);
      } else {
        console.error('API Error:', data.error || 'Unknown error');
        // Remove the placeholder and inform the user
        removePlaceholder(placeholderId);
        setHasError(true);
        setTimeout(() => setHasError(false), 3000);
      }

      // Reset input after submission
      setInputValue('');
      setShowInput(false);
    } catch (err) {
      console.error('Submission error:', err);
      // Remove the placeholder and inform the user
      removePlaceholder(placeholderIdRef.current);
      setHasError(true);
      setTimeout(() => setHasError(false), 3000);
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to replace the placeholder with generated content using typewriter effect
  const replacePlaceholderWithContent = (placeholderId: string, text: string) => {
    const placeholderNode = editor.view.dom.querySelector(`#${placeholderId}`);

    if (!placeholderNode) {
      console.error('Placeholder node not found.');
      // As a fallback, insert at the recorded position
      if (insertionPositionRef.current !== null) {
        typeWriterEffect(editor, insertionPositionRef.current, text);
      }
      return;
    }

    // Get the position of the placeholder node
    const pos = editor.view.posAtDOM(placeholderNode, 0);

    if (pos === null) {
      console.error('Could not determine position of placeholder.');
      return;
    }

    // Delete the placeholder node
    editor.chain().focus().deleteRange({ from: pos, to: pos + placeholderNode.textContent!.length }).run();

    // Insert the generated content with typewriter effect
    typeWriterEffect(editor, pos, text);
  };

  // Function to remove the placeholder node
  const removePlaceholder = (placeholderId: string | null) => {
    if (!placeholderId) return;

    const placeholderNode = editor.view.dom.querySelector(`#${placeholderId}`);

    if (placeholderNode) {
      const pos = editor.view.posAtDOM(placeholderNode, 0);
      if (pos !== null) {
        editor.chain().focus().deleteRange({ from: pos, to: pos + placeholderNode.textContent!.length }).run();
      }
    }

    placeholderIdRef.current = null;
    insertionPositionRef.current = null;
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
              placeholder="Write about..."
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
