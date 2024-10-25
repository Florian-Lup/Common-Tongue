// components/CustomFloatingMenu.tsx
import React, { useState } from 'react';
import { FloatingMenu as TiptapFloatingMenu, Editor } from '@tiptap/react';
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg';
import AIWriterInput from './AIWriterInput';
import './FloatingMenu.scss';

interface CustomFloatingMenuProps {
  editor: Editor;
  isProcessing: boolean;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
}

const CustomFloatingMenu: React.FC<CustomFloatingMenuProps> = ({
  editor,
  isProcessing,
  setIsProcessing,
}) => {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [insertionPosition, setInsertionPosition] = useState<number | null>(null);

  const handleAIWriterClick = () => {
    if (!editor) return;

    // Get the current selection position
    const { to, empty, head } = editor.state.selection;
    const position = empty ? head : to; // Insert at cursor if selection is empty, else at end of selection

    setInsertionPosition(position);
    setIsInputVisible(true);
  };

  const handleCloseInput = () => {
    setIsInputVisible(false);
    setInsertionPosition(null);
  };

  return (
    <>
      {!isInputVisible && (
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
              disabled={isProcessing}
            >
              <svg className="icon">
                <use href={`${remixiconUrl}#ri-edit-fill`} />
              </svg>
              AI Writer
            </button>
            {/* You can include other buttons or menu items here */}
          </div>
        </TiptapFloatingMenu>
      )}
      {isInputVisible && insertionPosition !== null && (
        <AIWriterInput
          editor={editor}
          insertionPosition={insertionPosition}
          onClose={handleCloseInput}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
        />
      )}
    </>
  );
};

export default CustomFloatingMenu;