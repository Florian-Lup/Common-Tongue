import React, { useState } from 'react';
import { BubbleMenu, BubbleMenuProps } from '@tiptap/react';
import './BubbleMenu.scss';

interface CustomBubbleMenuProps extends BubbleMenuProps {
  editor: BubbleMenuProps['editor'];
}

const CustomBubbleMenu: React.FC<CustomBubbleMenuProps> = ({ editor }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFixGrammar = async () => {
    if (!editor) return;

    const selectedText = editor.state.selection.content().content.textBetween(0, editor.state.selection.content().size, "\n");

    if (!selectedText) {
      alert('Please select some text to fix grammar.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/fix-grammar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: selectedText }),
      });

      const data = await response.json();

      const correctedText = data.correctedText;

      if (correctedText) {
        editor.chain().focus().setTextSelection(editor.state.selection).insertContent(correctedText).run();
      } else {
        alert('No grammar suggestions were found.');
      }
    } catch (error) {
      console.error('Error fixing grammar:', error);
      alert('An error occurred while fixing grammar. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{
        duration: 100,
        placement: 'bottom'
      }}
    >
      <div className="bubble-menu">
        <button onClick={handleFixGrammar} disabled={isLoading}>
          {isLoading ? 'Fixing...' : 'Fix Grammar'}
        </button>
      </div>
    </BubbleMenu>
  );
};

export default CustomBubbleMenu;