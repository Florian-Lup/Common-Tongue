// components/FixedMenu.tsx
import React from 'react';
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg';
import './FixedMenu.scss';

interface FixedMenuProps {
  onFixGrammar: () => void;
  onCompose: () => void;
  isProcessing: boolean;
}

const FixedMenu: React.FC<FixedMenuProps> = ({ onFixGrammar, onCompose, isProcessing }) => {
  return (
    <div className="fixed-menu">
      <button onClick={onFixGrammar} disabled={isProcessing} title="Fix Grammar">
        <svg className="icon">
          <use href={`${remixiconUrl}#ri-eraser-fill`} />
        </svg>
        Fix Grammar
      </button>
      <button onClick={onCompose} disabled={isProcessing} title="Compose">
        <svg className="icon">
          <use href={`${remixiconUrl}#ri-edit-fill`} />
        </svg>
        Compose
      </button>
    </div>
  );
};

export default FixedMenu;
