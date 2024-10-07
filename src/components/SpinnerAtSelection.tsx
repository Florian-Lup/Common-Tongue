import React, { useEffect, useState } from 'react';
import { Editor } from '@tiptap/react';
import './SpinnerAtSelection.scss';

interface SpinnerAtSelectionProps {
  editor: Editor;
}

const SpinnerAtSelection: React.FC<SpinnerAtSelectionProps> = ({ editor }) => {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(
    null
  );

  useEffect(() => {
    const { from, to } = editor.state.selection;

    // Get the coordinates at the start and end of the selection
    const startCoords = editor.view.coordsAtPos(from);
    const endCoords = editor.view.coordsAtPos(to);

    // Calculate the center of the selection
    const top = (startCoords.top + endCoords.bottom) / 2;
    const left = (startCoords.left + endCoords.right) / 2;

    setPosition({ top, left });
  }, [editor]);

  if (!position) return null;

  return (
    <div
      className="spinner-at-selection"
      style={{
        position: 'absolute',
        top: position.top + window.scrollY,
        left: position.left + window.scrollX,
        zIndex: 1000,
      }}
    >
      <div className="spinner"></div>
    </div>
  );
};

export default SpinnerAtSelection;
