import React from "react";
import type { Editor } from "@tiptap/react";
import GrammarAgent from "./agents/GrammarAgent"; // Import GrammarAgent
import "./MenuBar.scss";

interface MenuBarProps {
  editor: Editor;
  isTyping: boolean;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
}

const MenuBar: React.FC<MenuBarProps> = ({
  editor,
  isTyping,
  setIsTyping,
  setIsProcessing,
}) => {
  return (
    <div className="editor__header">
      <div className="menu-bar">
        {/* Other buttons in the menu bar can go here */}

        <GrammarAgent
          editor={editor}
          isTyping={isTyping}
          setIsTyping={setIsTyping}
          setIsProcessing={setIsProcessing}
        />
      </div>
    </div>
  );
};

export default MenuBar;
