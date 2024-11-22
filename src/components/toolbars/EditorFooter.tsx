// components/EditorFooter.tsx

import React from "react";
import type { Editor } from "@tiptap/react";
import remixiconUrl from "remixicon/fonts/remixicon.symbol.svg";
import "../../styles/components/editor/EditorFooter.scss";

interface EditorFooterProps {
  characterCount: number;
  editor: Editor;
}

interface MenuItemProps {
  icon: string;
  title: string;
  action: () => void;
  isActive?: () => boolean;
}

const EditorFooter: React.FC<EditorFooterProps> = ({
  characterCount,
  editor,
}) => {
  const items: MenuItemProps[] = [
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
      <div className="action-toolbar">
        {items.map((item, index) => renderMenuItem(item, index))}
      </div>
      <div className="character-count">{characterCount} characters</div>
    </div>
  );
};

export default EditorFooter;
