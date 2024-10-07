import React, { useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
// ... other imports

const App: React.FC = () => {
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const editor = useEditor({
    extensions: [
      // ... extensions
    ],
    editable: !isProcessing, // Editor is editable during typewriter effect
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="editor">
      <MenuBar editor={editor} />
      <EditorContent className="editor__content" editor={editor} spellCheck={false} />
      <CustomBubbleMenu
        editor={editor}
        isTyping={isTyping}
        setIsTyping={setIsTyping}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
      />
      <div className="character-count">{editor.storage.characterCount.characters()} characters</div>
    </div>
  );
};

export default App;
