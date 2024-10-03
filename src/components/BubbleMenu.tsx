import React from 'react';
import { BubbleMenu } from '@tiptap/react';
import './BubbleMenu.scss';

const CustomBubbleMenu: React.FC<{ editor: any }> = ({ editor }) => {
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

    const requestBody = {
      inputs: {
        manuscript: selectedText
      },
      version: '^1.0'
    };

    console.log("Request body:", JSON.stringify(requestBody));

    try {
      const apiUrl = '/api/fixGrammar'; // Use the local API endpoint
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Failed to fix grammar');
      }

      const data = await response.json();
      console.log('Grammar suggestions:', data);
      if (data.improved_text && data.improved_text.length > 0) {
        editor.chain().focus().setTextSelection(editor.state.selection).insertContent(data.improved_text).run();
        console.log("Grammar suggestion applied:", data.improved_text);
      } else {
        console.log("No grammar suggestions received");
      }
    } catch (error) {
      console.error('Error fixing grammar:', error instanceof Error ? error.message : String(error));
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
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