// components/CustomFloatingMenu.tsx
import React from 'react';
import { FloatingMenu as TiptapFloatingMenu, Editor } from '@tiptap/react';
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg';
import './FloatingMenu.scss';

interface CustomFloatingMenuProps {
  editor: Editor;
  onAIWriterButtonClick: (position: number) => void; // Updated prop
}

const CustomFloatingMenu: React.FC<CustomFloatingMenuProps> = ({
  editor,
  onAIWriterButtonClick,
}) => {
  const handleAIWriterClick = () => {
    const { selection } = editor.state;
    const position = selection.anchor; // Get the current cursor position

    onAIWriterButtonClick(position); // Trigger the handler with position
  };

  return (
    <TiptapFloatingMenu
      editor={editor}
      tippyOptions={{
        duration: 100,
        placement: 'bottom-start',
      }}
      className="floating-menu"
    >
      <div className="floating-menu-content">
        <button
          onClick={handleAIWriterClick}
          className="floating-menu-button"
          aria-label="AI Writer"
        >
          <svg className="icon">
            <use href={`${remixiconUrl}#ri-edit-fill`} />
          </svg>
          AI Writer
        </button>
        {/* Include other menu items here if needed */}
      </div>
    </TiptapFloatingMenu>
  );
};

export default CustomFloatingMenu;
