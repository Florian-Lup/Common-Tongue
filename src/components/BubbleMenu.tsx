import React from 'react';
import { BubbleMenu, Editor } from '@tiptap/react';
import './BubbleMenu.scss';

interface CustomBubbleMenuProps {
  editor: Editor;
}

const CustomBubbleMenu: React.FC<CustomBubbleMenuProps> = ({ editor }) => {
  const handleFixGrammar = async () => {
    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      ' '
    );

    if (!selectedText) {
      console.log('No text selected.');
      return;
    }

    console.log('Selected text:', selectedText);

    try {
      // API request to your serverless function on Vercel
      const response = await fetch('/api/fixGrammar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: { manuscript: selectedText },
          version: '^1.0',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const { finalRevision } = data;
        console.log('Final revision:', finalRevision);

        // Replace the selected text with the final revision in the editor
        editor.commands.insertContentAt(editor.state.selection.from, finalRevision);
      } else {
        console.error('Error fixing grammar:', data.error || data.details);
      }
    } catch (error) {
      console.error('Error fixing grammar:', error);
    }
  };

  return (
    <BubbleMenu editor={editor} tippyOptions={{ duration: 100, placement: 'bottom' }}>
      <div className="bubble-menu">
        <button onClick={handleFixGrammar}>Fix Grammar</button>
      </div>
    </BubbleMenu>
  );
};

export default CustomBubbleMenu;
