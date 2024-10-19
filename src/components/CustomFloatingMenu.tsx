// components/CustomFloatingMenu.tsx
import React from 'react';
import { FloatingMenu as TiptapFloatingMenu, Editor } from '@tiptap/react';
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg'; 
import './CustomFloatingMenu.scss';

interface CustomFloatingMenuProps {
  editor: Editor;
}

const CustomFloatingMenu: React.FC<CustomFloatingMenuProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <TiptapFloatingMenu
      editor={editor}
      tippyOptions={{
        duration: 100,
        placement: 'bottom-start',
      }}
      className="floating-menu" // Apply the floating-menu class here
    >
      <button
        onClick={() => {
          // Define the action when the "Write" button is clicked
          alert('Write button clicked!');
        }}
        className="floating-menu-button"
        aria-label="Write"
      >
      <svg className="icon">
        <use href={`${remixiconUrl}#ri-edit-fill`} />
       </svg>
        Compose
      </button>
    </TiptapFloatingMenu>
  );
};

export default CustomFloatingMenu;
