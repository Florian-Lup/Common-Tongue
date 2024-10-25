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
  isTyping: boolean;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
}

const CustomFloatingMenu: React.FC<CustomFloatingMenuProps> = ({
  editor,
  isProcessing,
  setIsProcessing,
  isTyping,
  setIsTyping,
}) => {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [insertionPosition, setInsertionPosition] = useState<number | null>(null);

  const handleAIWriterClick = () => {
    if (!editor) return;

    const { to, empty, head } = editor.state.selection;
    const position = empty ? head : to;

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
              disabled={isProcessing || isTyping}
            >
              <svg className="icon">
                <use href={`${remixiconUrl}#ri-edit-fill`} />
              </svg>
              AI Writer
            </button>
            {/* Other menu items */}
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
          isTyping={isTyping}
          setIsTyping={setIsTyping}
        />
      )}
    </>
  );
};

export default CustomFloatingMenu;