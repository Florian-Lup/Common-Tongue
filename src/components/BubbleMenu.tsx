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

    console.log('Selected text:', selectedText); // Log the selected text

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

    console.log('Request body:', JSON.stringify(requestBody)); // Log the request body

    try {
      const response = await fetch(process.env.WORDWARE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.WORDWARE_API_KEY}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status); // Log the response status

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText); // Log the error response text
        throw new Error('Failed to fix grammar');
      }

      const data = await response.json();
      console.log('Grammar suggestions:', data); // Log the received data
      if (data.suggestions && data.suggestions.length > 0) {
        editor.chain().focus().setTextSelection(editor.state.selection).insertContent(data.suggestions[0]).run();
      }
    } catch (error) {
      console.error('Error fixing grammar:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
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