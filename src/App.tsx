import React, { useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CharacterCount from '@tiptap/extension-character-count';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import MenuBar from './components/MenuBar';
import CustomBubbleMenu from './components/BubbleMenu';

const App: React.FC = () => {
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      Link.configure({ openOnClick: true, linkOnPaste: true }),
      CharacterCount.configure({ limit: 5000 }),
      Placeholder.configure({
        placeholder: 'Write a short paragraph...',
        emptyEditorClass: 'is-editor-empty',
      }),
      Bold,
      Italic,
      Underline,
      Strike,
      TextStyle,
      Color,
      Highlight,
      Heading.configure({
        levels: [1, 2],
      }),
      BulletList,
      OrderedList,
      ListItem,
      TaskList,
      TaskItem,
    ],
    editable: !isProcessing,
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="editor">
      <MenuBar editor={editor} />
      <EditorContent
        className="editor__content"
        editor={editor}
        spellCheck={false}
      />
      <CustomBubbleMenu
        editor={editor}
        isTyping={isTyping}
        setIsTyping={setIsTyping}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
      />
      <div className="character-count">
        {editor.storage.characterCount.characters()} characters
      </div>
    </div>
  );
};

export default App;
