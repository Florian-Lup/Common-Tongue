// App.tsx
import React, { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import CharacterCount from "@tiptap/extension-character-count";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import MenuBar from "./components/MarksNodes/MenuBar";
import Link from "@tiptap/extension-link";
import CustomBubbleMenu from "./components/BubbleMenu";
import Focus from "@tiptap/extension-focus";

const App: React.FC = () => {
  // Global States
  const [isTyping, setIsTyping] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // New Error State

  // Initialize the TipTap editor with desired extensions and configurations
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: true, linkOnPaste: true }),
      Highlight.configure({ multicolor: true }),
      TaskList,
      TaskItem,
      CharacterCount.configure({ limit: 10000 }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          switch (node.type.name) {
            case "paragraph":
              return "Write something...";
            case "heading":
              return "What’s the title?";
            default:
              return "";
          }
        },
        emptyNodeClass: "empty-node",
      }),
      Underline,
      TextStyle,
      Color,
      Focus.configure({
        className: "has-focus", // Custom class for focused nodes
        mode: "shallowest",
      }),
    ],
    editable: true, // Always editable
    onUpdate: ({ editor }) => {
      setCharacterCount(editor.storage.characterCount.characters());
    },
    editorProps: {
      handleDOMEvents: {
        beforeinput: (_view, event) => {
          if (isTyping || isProcessing) {
            event.preventDefault();
            return true; // Prevent the default behavior
          }
          return false; // Allow the default behavior
        },
        keydown: (_view, event) => {
          if (isTyping || isProcessing) {
            // Prevent key-based editing actions except for non-blocking keys
            const nonBlockingKeys = [
              "ArrowLeft",
              "ArrowRight",
              "ArrowUp",
              "ArrowDown",
              "Shift",
              "Control",
              "Alt",
              "Meta",
              "Tab",
              "Escape",
            ];
            if (!nonBlockingKeys.includes(event.key)) {
              event.preventDefault();
              return true;
            }
          }
          return false;
        },
      },
    },
  });

  if (!editor) {
    return null; // Render nothing if the editor is not initialized
  }

  return (
    <div className={`editor-container ${isProcessing ? "processing" : ""}`}>
      <div className="editor">
        {/* Toolbar/Menu Bar */}
        <MenuBar editor={editor} />

        {/* Editor Content */}
        <EditorContent
          className="editor__content"
          editor={editor}
          spellCheck={false}
          aria-disabled={isTyping || isProcessing}
        />

        {/* Error Message Display */}
        {errorMessage && (
          <div className="error-message" role="alert">
            {errorMessage}
          </div>
        )}

        {/* Footer with Character Count */}
        <div className="editor__footer">
          <div className="character-count">{characterCount} characters</div>
        </div>

        {/* Custom Bubble Menu with Props for Managing States */}
        <CustomBubbleMenu
          editor={editor}
          isTyping={isTyping}
          isProcessing={isProcessing}
          setIsTyping={setIsTyping}
          setIsProcessing={setIsProcessing}
          setErrorMessage={setErrorMessage} // Pass the setter for error messages
        />

        {/* Overlay to Prevent Interaction During Processing/Typing */}
        {(isTyping || isProcessing) && (
          <div className="overlay" aria-hidden="true"></div>
        )}
      </div>
    </div>
  );
};

export default App;