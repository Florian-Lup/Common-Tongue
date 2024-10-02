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
    const selectedText = editor.state.selection.content().content.textBetween(0, editor.state.selection.content().size, ' ');

    try {
      const response = await fetch('/api/fixGrammar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: {
            manuscript: selectedText
          },
          version: '^1.0'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fix grammar');
      }

      const data = await response.json();
      console.log('Grammar suggestions:', data);
      if (data.suggestions && data.suggestions.length > 0) {
        editor.chain().focus().setTextSelection(editor.state.selection).insertContent(data.suggestions[0]).run();
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