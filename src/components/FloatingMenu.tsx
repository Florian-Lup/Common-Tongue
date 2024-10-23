// components/CustomFloatingMenu.tsx
import React from 'react';
import { FloatingMenu as TiptapFloatingMenu, Editor } from '@tiptap/react';
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg';
import './FloatingMenu.scss';

interface CustomFloatingMenuProps {
  editor: Editor;
  onWriterInputClick: () => void; // Updated prop name
}

const CustomFloatingMenu: React.FC<CustomFloatingMenuProps> = ({ editor, onWriterInputClick }) => {
  return (
    <TiptapFloatingMenu
      editor={editor}
      tippyOptions={{ duration: 100, placement: 'bottom-start' }}
      className="floating-menu"
    >
      <div className="floating-menu-content">
        <button
          onClick={onWriterInputClick}
          className="floating-menu-button"
          aria-label="Writer Input"
        >
          <svg className="icon">
            <use href={`${remixiconUrl}#ri-edit-fill`} />
          </svg>
          AI Writer
        </button>
      </div>
    </TiptapFloatingMenu>
  );
};

export default CustomFloatingMenu;
