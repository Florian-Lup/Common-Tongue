// FixedMenu.tsx
import React from 'react';

interface FixedMenuProps {
  onFixGrammar: () => void;
  onCompose: () => void;
  isProcessing: boolean;
}

const FixedMenu: React.FC<FixedMenuProps> = ({ onFixGrammar, onCompose, isProcessing }) => {
  return (
    <div className="fixed-menu">
      <button onClick={onFixGrammar} disabled={isProcessing}>
        Fix Grammar
      </button>
      <button onClick={onCompose} disabled={isProcessing}>
        Compose
      </button>
      {/* Add other menu buttons as needed, disabling them based on isProcessing */}
    </div>
  );
};

export default FixedMenu;
