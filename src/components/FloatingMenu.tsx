// components/CustomFloatingMenu.tsx
import React from 'react';
import { FloatingMenu as TiptapFloatingMenu, Editor } from '@tiptap/react';
import { Node } from '@tiptap/core';
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg';
import './FloatingMenu.scss';

interface CustomFloatingMenuProps {
  editor: Editor;
  onWriterInputClick: () => void;
  showWriterInput: boolean;
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
        // Hide the floating menu when WriterInput is open
        if (showWriterInput) {
          return false;
        }

        // Condition 1: Editor is focused
        if (!editor.isFocused) {
          return false;
        }

        // Condition 2: The selected node has the 'has-focus' class
        const { from } = editor.state.selection;
        const node = editor.state.doc.nodeAt(from);

        if (node) {
          // Access node decorations or attributes to check for 'has-focus' class
          // Since 'has-focus' is a class added via decoration, we need to check decorations
          const decorations = editor.view.docView?.nodeDOM(from)?.classList;
          if (decorations && decorations.contains('has-focus')) {
            return true;
          }
        }

        return false;
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