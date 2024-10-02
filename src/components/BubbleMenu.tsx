import React from 'react';
import { BubbleMenu, BubbleMenuProps } from '@tiptap/react';
import './BubbleMenu.scss';

interface CustomBubbleMenuProps extends BubbleMenuProps {
  editor: BubbleMenuProps['editor'];
}

const CustomBubbleMenu: React.FC<CustomBubbleMenuProps> = ({ editor }) => {
  const handleFixGrammar = () => {
    console.log('Fix Grammar button clicked');
    alert('Grammar check functionality will be implemented in the next task.');
  };

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{
        duration: 100,
        placement: 'top'
      }}
    >
      <div className="bubble-menu">
        <button onClick={handleFixGrammar}>Fix Grammar</button>
      </div>
    </BubbleMenu>
  );
};

export default CustomBubbleMenu;