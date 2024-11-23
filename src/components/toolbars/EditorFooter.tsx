// components/EditorFooter.tsx

import React from "react";
import type { Editor } from "@tiptap/react";
import remixiconUrl from "remixicon/fonts/remixicon.symbol.svg";
import "../../styles/editor/EditorFooter.scss";

// Footer component for the editor with utility actions and character count
// Provides common operations like copy, clear, undo/redo

interface EditorFooterProps {
  characterCount: number; // Current character count in editor
  editor: Editor; // TipTap editor instance
}

interface MenuItemProps {
  icon: string; // Remix icon name
  title: string; // Tooltip text
  action: () => void; // Click handler
  isActive?: () => boolean; // Whether the action is currently active
}

const EditorFooter: React.FC<EditorFooterProps> = ({
  characterCount,
  editor,
}) => {
  // Define utility actions available in the footer
  const items: MenuItemProps[] = [
    // Copy text, clear content, remove formatting, undo/redo
    {
      icon: "clipboard-line",
      title: "Copy Text",
      action: () => {
        const editorText = editor.getText();
        navigator.clipboard
          .writeText(editorText)
          .then(() => alert("Text copied to clipboard!"))
          .catch((err) => console.error("Failed to copy text: ", err));
      },
    },
    {
      icon: "delete-bin-line",
      title: "Delete Text",
      action: () => {
        editor.chain().focus().clearContent().run();
      },
    },
    {
      icon: "format-clear",
      title: "Clear Format",
      action: () => editor.chain().focus().clearNodes().unsetAllMarks().run(),
    },
    {
      icon: "arrow-go-back-line",
      title: "Undo",
      action: () => editor.chain().focus().undo().run(),
    },
    {
      icon: "arrow-go-forward-line",
      title: "Redo",
      action: () => editor.chain().focus().redo().run(),
    },
  ];

  const renderMenuItem = (item: MenuItemProps, index: number) => {
    const { icon, title, action, isActive } = item;

    return (
      <button
        key={`footer-button-${index}`}
        className={`toolbar-item${isActive && isActive() ? " is-active" : ""}`}
        onClick={action}
        title={title}
      >
        <svg className="remix">
          <use xlinkHref={`${remixiconUrl}#ri-${icon}`} />
        </svg>
      </button>
    );
  };

  return (
    <div className="editor-footer">
      {/* Render action buttons */}
      <div className="action-toolbar">
        {items.map((item, index) => renderMenuItem(item, index))}
      </div>
      {/* Display character count */}
      <div className="character-count">{characterCount} characters</div>
    </div>
  );
};

export default EditorFooter;
