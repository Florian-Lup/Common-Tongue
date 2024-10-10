// App.tsx
import React, { useState, useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import CharacterCount from '@tiptap/extension-character-count';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import MenuBar from './components/MenuBar';
import Link from '@tiptap/extension-link';
import CustomBubbleMenu from './components/BubbleMenu';

const App: React.FC = () => {
  const [isTyping, setIsTyping] = useState(false);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: true, linkOnPaste: true }),
      Highlight.configure({ multicolor: true }),
      TaskList,
      TaskItem,
      CharacterCount.configure({ limit: 5000 }),
      Placeholder.configure({ placeholder: 'Write a short paragraph...', emptyEditorClass: 'is-editor-empty' }),
      Underline,
      TextStyle,
      Color,
    ],
    editable: !isTyping,
  });

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('.editor__header');
      if (header) {
        const sticky = header.getBoundingClientRect().top <= 0;
        setIsHeaderSticky(sticky);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!editor) {
    return null;
  }

  const characterCount = editor.storage.characterCount.characters();

  return (
    <div className="editor-container">
      {/* Header Wrapper */}
      <div className="editor-header-wrapper">
        <div className={`editor__header${isHeaderSticky ? ' sticky' : ''}`}>
          <MenuBar editor={editor} />
        </div>
      </div>
      
      {/* Editor Content */}
      <div className="editor">
        <EditorContent className="editor__content" editor={editor} spellCheck={false} />
        <div className="character-count">
          {characterCount} characters
        </div>
        <CustomBubbleMenu editor={editor} isTyping={isTyping} setIsTyping={setIsTyping} />
      </div>
    </div>
  );
};

export default App;
