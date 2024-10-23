// components/CustomFloatingMenu.tsx
import React from 'react';
import { FloatingMenu as TiptapFloatingMenu, Editor } from '@tiptap/react';
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg';
import './FloatingMenu.scss';

interface CustomFloatingMenuProps {
  editor: Editor;
  onWriterInputClick: () => void;
  showWriterInput: boolean; // Receive the state to control visibility
}

const CustomFloatingMenu: React.FC<CustomFloatingMenuProps> = ({
  editor,
  onWriterInputClick,
  showWriterInput,
}) => {
  return (
    <TiptapFloatingMenu
      editor={editor}
      tippyOptions={{ duration: 100, placement: 'bottom-start' }}
      className="floating-menu"
      shouldShow={({ editor }) => {
        // Hide the floating menu when showWriterInput is true
        if (showWriterInput) {
          return false;
        }
        // Default behavior: show when the editor is focused
        return editor.isFocused;
      }}
    >
      <div className="floating-menu-content">
        <button
          onClick={() => {
            onWriterInputClick();
          }}
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