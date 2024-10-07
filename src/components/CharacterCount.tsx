import React from 'react';
import { Editor } from '@tiptap/react';
import './CharacterCount.scss';

interface CharacterCountProps {
  editor: Editor;
}

const CharacterCount: React.FC<CharacterCountProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="character-count">
      {editor.storage.characterCount.characters()} characters
    </div>
  );
};

export default CharacterCount;