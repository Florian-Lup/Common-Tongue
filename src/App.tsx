// App.tsx
import React from "react";
import { EditorContent, useEditor } from "@tiptap/react"; // Import Tiptap editor components
import CharacterCount from "@tiptap/extension-character-count"; // Import character count extension
import Highlight from "@tiptap/extension-highlight"; // Import highlight extension
import StarterKit from "@tiptap/starter-kit"; // Import starter kit for basic functionality
import Placeholder from "@tiptap/extension-placeholder"; // Import placeholder extension
import Underline from "@tiptap/extension-underline"; // Import underline extension
import TextStyle from "@tiptap/extension-text-style"; // Import text style extension
import Color from "@tiptap/extension-color"; // Import color extension
import Focus from "@tiptap/extension-focus"; // Import focus extension
import EditorHeader from "./components/toolbars/EditorHeader"; // Import header component
import EditorNodes from "./components/toolbars/EditorNodes"; // Import nodes toolbar component
import EditorMarks from "./components/toolbars/EditorMarks"; // Import marks toolbar component
import EditorFooter from "./components/toolbars/EditorFooter"; // Import footer component

const App: React.FC = () => {
  // Initialize the Tiptap editor with various extensions
  const editor = useEditor({
    extensions: [
      StarterKit, // Basic editor functionality
      Highlight.configure({ multicolor: true }), // Enable multicolor highlights
      CharacterCount.configure({ limit: 5000 }), // Set character limit
      Placeholder.configure({
        placeholder: ({ node }) => {
          // Define placeholder text based on node type
          switch (node.type.name) {
            case "paragraph":
              return "Write something..."; // Placeholder for paragraphs
            case "heading":
              return "Add a title"; // Placeholder for headings
            default:
              return ""; // Default case
          }
        },
        emptyNodeClass: "empty-node", // Class for empty nodes
      }),
      Underline, // Enable underline functionality
      TextStyle, // Enable text styling
      Color, // Enable text color options
      Focus.configure({
        className: "has-focus", // Class for focused elements
        mode: "shallowest", // Focus mode
      }),
    ],
    editable: true, // Allow editing
  });

  if (!editor) {
    return null; // Return null if editor is not initialized
  }

  return (
    <div className="editor-container">
      <div className="editor">
        {/* Render the header with editor instance */}
        <EditorHeader editor={editor} />

        {/* Render the editor content area */}
        <EditorContent
          className="editor__content"
          editor={editor}
          spellCheck={false}
        />

        {/* Render the nodes toolbar */}
        <EditorNodes editor={editor} />

        {/* Render the marks toolbar */}
        <EditorMarks editor={editor} />

        {/* Render the footer with editor instance and character count */}
        <EditorFooter
          editor={editor}
          characterCount={editor.storage.characterCount.characters()}
        />
      </div>
    </div>
  );
};

export default App; // Export the App component
