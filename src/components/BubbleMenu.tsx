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

    if (!selectedText.trim()) {
      console.error('Error fixing grammar: No text selected');
      alert('Please select some text to fix grammar.');
      return;
    }

    const requestBody = {
      inputs: {
        manuscript: selectedText
      },
      version: '^1.0'
    };

    try {
      const apiUrl = '/api/fixGrammar'; // Use the local API endpoint
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Failed to fix grammar');
      }

      const data = await response.json();
      if (data.suggestions && data.suggestions.length > 0) {
        editor.chain().focus().setTextSelection(editor.state.selection).insertContent(data.suggestions[0]).run();
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fixing grammar:', error.message);
        console.error('Error stack:', error.stack);
      } else {
        console.error('Error fixing grammar:', String(error));
      }
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