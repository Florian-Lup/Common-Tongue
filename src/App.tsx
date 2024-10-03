import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import MenuBar from "./components/MenuBar";
import CustomBubbleMenu from "./components/BubbleMenu";

export default function App() {
  const editor = useEditor({
    extensions: [
      StarterKit.configure(),
      Placeholder.configure({
        placeholder: "Write a short paragraph...",
        emptyEditorClass: "is-editor-empty",
      }),
      Underline,
      TextStyle,
      Color,
    ],
  });

  return (
    <div className="editor">
      <MenuBar editor={editor} />
      <EditorContent
        className="editor__content"
        editor={editor}
        spellCheck={false}
      />
      <CustomBubbleMenu editor={editor} children={undefined} />
    </div>
  );
}