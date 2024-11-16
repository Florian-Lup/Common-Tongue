// App.tsx
import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import CharacterCount from "@tiptap/extension-character-count";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Focus from "@tiptap/extension-focus";
import EditorHeader from "./components/toolbars/EditorHeader";
import EditorNodes from "./components/toolbars/EditorNodes";
import EditorMarks from "./components/toolbars/EditorMarks";
import EditorFooter from "./components/toolbars/EditorFooter";

const App: React.FC = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight.configure({ multicolor: true }),
      CharacterCount.configure({ limit: 10000 }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          switch (node.type.name) {
            case "paragraph":
              return "Write something...";
            case "heading":
              return "Add a title";
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
        className: "has-focus",
        mode: "shallowest",
      }),
    ],
    editable: true,
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="editor-container">
      <div className="editor">
        <EditorHeader editor={editor} />
        <EditorContent
          className="editor__content"
          editor={editor}
          spellCheck={false}
        />
        <EditorNodes editor={editor} />
        <EditorMarks editor={editor} />
        <EditorFooter
          editor={editor}
          characterCount={editor.storage.characterCount.characters()}
        />
      </div>
    </div>
  );
};

export default App;
