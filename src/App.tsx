import React, { useState } from 'react';
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
import Focus from '@tiptap/extension-focus';
import AIWriterInput from './components/AIWriterInput';

const App: React.FC = () => {
  const [isTyping, setIsTyping] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // State to manage the AI Writer input component
  const [showAIWriterInput, setShowAIWriterInput] = useState(false);
  const [insertionPosition, setInsertionPosition] = useState<number | null>(null);

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
              return 'What’s the title?';
            default:
              return '';
          }
        },
        emptyNodeClass: 'empty-node',
      }),
      Underline,
      TextStyle,
      Color,
      Focus.configure({
        className: 'has-focus',
        mode: 'shallowest',
      }),
    ],
    editable: !isTyping,
    onUpdate: ({ editor }) => {
      setCharacterCount(editor.storage.characterCount.characters());
    },
  });

  if (!editor) {
    return null;
  }

  // Handler for AI Writer button click
  const handleAIWriterButtonClick = () => {
    const position = editor.state.selection.anchor;
    setShowAIWriterInput(true); // Show AIWriterInput
    setInsertionPosition(position);
  };

  return (
    <div className={`editor-container ${isProcessing ? 'processing' : ''}`}>
      <div className="editor">
        <MenuBar editor={editor} />
        <EditorContent className="editor__content" editor={editor} spellCheck={false} />
        <div className="editor__footer">
          <div className="character-count">{characterCount} characters</div>
        </div>
        <CustomBubbleMenu
          editor={editor}
          isTyping={isTyping}
          isProcessing={isProcessing}
          setIsTyping={setIsTyping}
          setIsProcessing={setIsProcessing}
        />

        {/* Inline Button for AI Writer - Display only when editor is empty and AIWriterInput is not visible */}
        {editor.isEmpty && !showAIWriterInput && (
          <button
            onClick={handleAIWriterButtonClick}
            className="ai-writer-inline-button"
          >
            Start Writing with AI
          </button>
        )}

        {/* Render AIWriterInput when triggered */}
        {showAIWriterInput && (
          <AIWriterInput
            editor={editor}
            insertionPosition={insertionPosition}
            isProcessing={isProcessing}
            setIsTyping={setIsTyping}
            setIsProcessing={setIsProcessing}
            onClose={() => setShowAIWriterInput(false)}
          />
        )}
      </div>
    </div>
  );
};

export default App;