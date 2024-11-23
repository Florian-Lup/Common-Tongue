// EditorMarks.tsx

import { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react";
import remixiconUrl from "remixicon/fonts/remixicon.symbol.svg";
import "../../styles/editor/MarksNodes.scss";

// A floating bubble menu component that provides text formatting options
// Appears when text is selected in the editor

interface MenuItemProps {
  icon?: string; // Remix icon name
  title?: string; // Tooltip text
  action?: () => void; // Click handler
  isActive?: () => boolean; // Whether the format is currently active
}

export default function EditorMarks({ editor }: { editor: Editor }) {
  if (!editor) {
    return null;
  }

  // Define available text formatting options
  const items: MenuItemProps[] = [
    // Bold, italic, underline, etc. formatting options
    {
      icon: "bold",
      title: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
    },
    {
      icon: "italic",
      title: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
    },
    {
      icon: "underline",
      title: "Underline",
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive("underline"),
    },
    {
      icon: "strikethrough",
      title: "Strike",
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive("strike"),
    },
    // Text color and highlighting options with specific color values
    {
      icon: "palette-line",
      title: "Text Color",
      action: () => {
        if (editor.isActive("textStyle", { color: "#fb7185" })) {
          editor.chain().focus().unsetColor().run();
        } else {
          editor.chain().focus().setColor("#fb7185").run();
        }
      },
      isActive: () => editor.isActive("textStyle", { color: "#fb7185" }),
    },
    {
      icon: "mark-pen-line",
      title: "Highlight",
      action: () => {
        if (editor.isActive("highlight", { color: "#fdba74" })) {
          editor.chain().focus().unsetHighlight().run();
        } else {
          editor.chain().focus().setHighlight({ color: "#fdba74" }).run();
        }
      },
      isActive: () => editor.isActive("highlight", { color: "#fdba74" }),
    },
  ];

  return (
    // Render bubble menu that appears on text selection
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      className="bubble-menu"
    >
      {/* Map formatting options to buttons */}
      {items.map((item, index) => {
        const { icon, title, action, isActive } = item;
        return (
          <button
            key={index}
            className={`menu-item${isActive && isActive() ? " is-active" : ""}`}
            onClick={action}
            title={title}
          >
            <svg className="remix">
              <use xlinkHref={`${remixiconUrl}#ri-${icon}`} />
            </svg>
          </button>
        );
      })}
    </BubbleMenu>
  );
}
