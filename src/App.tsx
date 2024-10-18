// App.tsx
import React, { useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CharacterCount from '@tiptap/extension-character-count';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Strike from '@tiptap/extension-strike';
import Focus from '@tiptap/extension-focus';
import MenuBar from './components/MenuBar';
import CustomBubbleMenu from './components/BubbleMenu';
import './App.scss'; // Ensure your styles are imported

const App: React.FC = () => {
  const [isTyping, setIsTyping] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: true, linkOnPaste: true }),
      Highlight.configure({ multicolor: true }),
      TaskList,
      TaskItem,
      CharacterCount.configure({ limit: 5000 }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          switch (node.type.name) {
            case 'paragraph':
              return 'Write something...';
            case 'heading':
              return 'What’s the title';
            // Add more cases as needed
            default:
              return '';
          }
        },
        emptyNodeClass: 'empty-node',
      }),
      Underline,
      TextStyle,
      Color,
      Strike,
      Focus.configure({
        className: 'has-focus',
        mode: 'shallowest',
      }),
    ],
    editable: !isTyping,
    onUpdate: ({ editor }) => {
      setCharacterCount(editor.storage.characterCount.characters());
      // Any additional onUpdate logic can go here
    },
    content: '<p>Hello World!</p>', // Optional: Initial content
  });

  if (!editor) {
    return null;
  }

  return (
    <div className={`editor-container ${isProcessing ? 'processing' : ''}`}>
      <div className="editor">
        <MenuBar editor={editor} />
        <EditorContent className="editor__content" editor={editor} spellCheck={false} />
        <div className="editor__footer">
          <div className="character-count">
            {characterCount} characters
          </div>
        </div>
        <CustomBubbleMenu
          editor={editor}
          isTyping={isTyping}
          setIsTyping={setIsTyping}
          setIsProcessing={setIsProcessing}
        />
      </div>
    </div>
  );
};

export default App;
