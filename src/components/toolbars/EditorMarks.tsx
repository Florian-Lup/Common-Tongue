// EditorMarks.tsx

import { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react";
import remixiconUrl from "remixicon/fonts/remixicon.symbol.svg";
import "../styles/MarksNodes.scss";

interface MenuItemProps {
  icon?: string;
  title?: string;
  action?: () => void;
  isActive?: () => boolean;
}

export default function EditorMarks({ editor }: { editor: Editor }) {
  if (!editor) {
    return null;
  }

  const items: MenuItemProps[] = [
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
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      className="bubble-menu"
    >
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
