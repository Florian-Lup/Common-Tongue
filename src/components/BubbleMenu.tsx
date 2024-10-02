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
    console.log('Selected text:', selectedText); // Updated log

    try {
      console.log('Request body:', JSON.stringify({ // Added log
        inputs: {
          manuscript: selectedText
        },
        version: '^1.0'
      }));

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

      console.log('Response status:', response.status); // Added log
      console.log('Response headers:', response.headers); // Added log

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText); // Added log
        throw new Error('Failed to fix grammar');
      }

      const data = await response.json();
      console.log('Grammar API Response:', JSON.stringify(data, null, 2));

      if (data.finalRevision) {
        console.log('Final revision:', data.finalRevision);
        editor.chain().focus().setTextSelection(editor.state.selection).insertContent(data.finalRevision).run();
      } else {
        console.log('No final revision available');
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