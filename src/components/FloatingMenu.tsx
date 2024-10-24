// src/components/CustomFloatingMenu.tsx
import React, { useState, useEffect, useRef } from 'react';
import { FloatingMenu as TiptapFloatingMenu, Editor } from '@tiptap/react';
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg';
import './FloatingMenu.scss';
import './styles/TempMessage.scss'; // Import the TempMessage styles

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

  // To store the insertion position
  const insertionPositionRef = useRef<number | null>(null);

  // To store the length of the temporary message
  const tempMessageLengthRef = useRef<number>(0);

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
      const { to, empty, head } = editor.state.selection;
      const position = empty ? head : to; // Insert at cursor if selection is empty, else at end of selection

      insertionPositionRef.current = position;

      // Define the temporary message
      const tempMessage = 'Generating content...';

      // Insert the temporary message using the custom TempMessage node
      editor.commands.setTempMessage({ text: tempMessage });

      // Store the length of the temporary message for later removal
      tempMessageLengthRef.current = tempMessage.length;

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
        // Replace the temporary message with the generated content
        replaceTempMessageWithContent(position, tempMessage.length, data.newContent);
      } else {
        console.error('API Error:', data.error || 'Unknown error');
        // Remove the temporary message and inform the user
        removeTempMessage(position, tempMessage.length);
        setHasError(true);
        // Insert an error message into the editor
        insertErrorMessage(position);
        // Remove the error highlight after 3 seconds
        setTimeout(() => setHasError(false), 3000);
      }

      // Reset input after submission
      setInputValue('');
      setShowInput(false);
    } catch (err) {
      console.error('Submission error:', err);
      // Remove the temporary message and inform the user
      if (insertionPositionRef.current !== null) {
        removeTempMessage(insertionPositionRef.current, tempMessageLengthRef.current);
        insertErrorMessage(insertionPositionRef.current);
      }
      setHasError(true);
      // Remove the error highlight after 3 seconds
      setTimeout(() => setHasError(false), 3000);
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Replaces the temporary message with the generated content using a typewriter effect.
   * @param from The starting position of the temporary message.
   * @param length The length of the temporary message.
   * @param text The generated content to insert.
   */
  const replaceTempMessageWithContent = (from: number, length: number, text: string) => {
    setIsTyping(true);

    // Delete the temporary message
    editor.chain().focus().deleteRange({ from, to: from + length }).run();

    // Insert the generated content with typewriter effect
    typeWriterEffect(editor, from, text);
  };

  /**
   * Removes the temporary message from the editor.
   * @param from The starting position of the temporary message.
   * @param length The length of the temporary message.
   */
  const removeTempMessage = (from: number, length: number) => {
    editor.chain().focus().deleteRange({ from, to: from + length }).run();
  };

  /**
   * Inserts an error message at the specified position.
   * @param from The position to insert the error message.
   */
  const insertErrorMessage = (from: number) => {
    const errorMessage = '❌ Failed to generate content.';
    editor.chain().focus().insertContentAt(from, errorMessage).run();

    // Optionally, wrap the error message in a span with a class for styling
    // editor.chain().focus().setNode('text', { ... }).run(); // Advanced usage

    // Remove the error message after 3 seconds
    setTimeout(() => {
      editor.chain().focus().deleteRange({ from, to: from + errorMessage.length }).run();
    }, 3000);
  };

  /**
   * Typewriter effect function to insert text character by character.
   * @param editor The TipTap editor instance.
   * @param from The starting position to insert the text.
   * @param text The text to insert.
   */
  const typeWriterEffect = (editor: Editor, from: number, text: string) => {
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
