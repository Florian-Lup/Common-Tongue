import CharacterCount from "@tiptap/extension-character-count";
import Highlight from "@tiptap/extension-highlight";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
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
      Highlight.configure({
        multicolor: true,
      }),
      TaskList,
      TaskItem,
      CharacterCount.configure({
        limit: 5000,
      }),
      Placeholder.configure({
        placeholder: "Write a short paragraph...",
        emptyEditorClass: "is-editor-empty",
      }),
      Underline,
      TextStyle,
      Color,
    ],
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="editor">
      {editor && <MenuBar editor={editor} />}
      <EditorContent
        className="editor__content"
        editor={editor}
        spellCheck={false}
      />
      {editor && <CustomBubbleMenu editor={editor} children={undefined} />}
      <div className="character-count">
        {editor.storage.characterCount.characters()} characters
      </div>
    </div>
  );
}