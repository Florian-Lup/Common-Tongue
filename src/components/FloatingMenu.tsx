// components/CustomFloatingMenu.tsx
import React, { useState } from 'react';
import { FloatingMenu as TiptapFloatingMenu, Editor } from '@tiptap/react';
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg';
import './FloatingMenu.scss';

interface CustomFloatingMenuProps {
  editor: Editor;
  showInputField: boolean; // Prop for showing the input field
  setShowInputField: React.Dispatch<React.SetStateAction<boolean>>; // Setter for input field visibility
}

const CustomFloatingMenu: React.FC<CustomFloatingMenuProps> = ({ editor, showInputField, setShowInputField }) => {
  const [inputValue, setInputValue] = useState('');

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
      className="floating-menu"
    >
      <button
        onClick={() => setShowInputField(!showInputField)} // Toggle input field visibility
        className="floating-menu-button"
        aria-label="Write"
      >
        <svg className="icon">
          <use href={`${remixiconUrl}#ri-edit-fill`} />
        </svg>
        AI Writer
      </button>

      {showInputField && (
        <div className="floating-menu-input-container">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Write your AI input here..."
            className="floating-menu-input"
          />
          <button
            onClick={() => {
              alert(`Input submitted: ${inputValue}`);
              setInputValue(''); // Clear the input field after submission
              setShowInputField(false); // Optionally hide the input field after submission
            }}
            className="submit-button"
          >
            Submit
          </button>
        </div>
      )}
    </TiptapFloatingMenu>
  );
};

export default CustomFloatingMenu;
