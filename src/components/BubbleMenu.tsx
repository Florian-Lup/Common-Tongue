import React from 'react';
import { BubbleMenu, BubbleMenuProps } from '@tiptap/react';
import './BubbleMenu.scss';
import { fixGrammar } from '../utils/apiUtils';

interface CustomBubbleMenuProps extends BubbleMenuProps {
  editor: any;
}

const CustomBubbleMenu: React.FC<CustomBubbleMenuProps> = ({ editor, ...props }) => {
  const handleFixGrammar = async () => {
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to);

    try {
      const improvedText = await fixGrammar(selectedText);
      editor.chain().focus().deleteSelection().insertContent(improvedText).run();
    } catch (error) {
      console.error('Failed to fix grammar:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <BubbleMenu
      {...props}
      editor={editor}
      tippyOptions={{ duration: 100, placement: 'bottom' }}
    >
      <button onClick={handleFixGrammar}>Fix Grammar</button>
    </BubbleMenu>
  );
};

export default CustomBubbleMenu;