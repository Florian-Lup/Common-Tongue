import React from 'react';
import { BubbleMenu, BubbleMenuProps } from '@tiptap/react';
import './BubbleMenu.scss';

interface CustomBubbleMenuProps extends BubbleMenuProps {
  editor: BubbleMenuProps['editor'];
}

const CustomBubbleMenu: React.FC<CustomBubbleMenuProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const handleFixGrammar = async () => {
    console.log("handleFixGrammar called");
    const selectedText = editor.state.selection.content().content.textBetween(0, editor.state.selection.content().size, ' ');
    console.log("Selected text:", selectedText);

    if (!selectedText.trim()) {
      console.error('Error fixing grammar: No text selected');
      alert('Please select some text to fix grammar.');
      return;
    }

    try {
      const response = await fetch('/api/fixGrammar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ manuscript: selectedText }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error('Failed to fix grammar');
      }

      const result = await response.json();
      console.log("Grammar suggestion received:", result);

      if (result.improved_text && result.improved_text.length > 0) {
        editor.chain().focus().setTextSelection(editor.state.selection).insertContent(result.improved_text).run();
        console.log("Grammar suggestion applied:", result.improved_text);
      } else {
        console.log("No grammar suggestions received");
      }
    } catch (error) {
      console.error('Error fixing grammar:', error);
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
        <button onClick={handleFixGrammar}>Fix Grammar</button>
      </div>
    </BubbleMenu>
  );
};

export default CustomBubbleMenu;