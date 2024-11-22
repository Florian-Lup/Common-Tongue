// EditorNodes.tsx

import { Editor } from "@tiptap/react";
import { FloatingMenu } from "@tiptap/react";
import remixiconUrl from "remixicon/fonts/remixicon.symbol.svg";
import "../../styles/components/editor/MarksNodes.scss";

// Define the interface here or import it
interface MenuItemProps {
  icon?: string;
  title?: string;
  action?: () => void;
  isActive?: () => boolean;
}

export default function EditorNodes({ editor }: { editor: Editor }) {
  if (!editor) {
    return null;
  }

  const items: MenuItemProps[] = [
    {
      icon: "h-1",
      title: "Heading 1",
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive("heading", { level: 1 }),
    },
    {
      icon: "h-2",
      title: "Heading 2",
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive("heading", { level: 2 }),
    },
    {
      icon: "h-3",
      title: "Heading 3",
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor.isActive("heading", { level: 3 }),
    },
    {
      icon: "paragraph",
      title: "Paragraph",
      action: () => editor.chain().focus().setParagraph().run(),
      isActive: () => editor.isActive("paragraph"),
    },
    {
      icon: "list-unordered",
      title: "Bullet List",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive("bulletList"),
    },
    {
      icon: "list-ordered",
      title: "Ordered List",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive("orderedList"),
    },
  ];

  return (
    <FloatingMenu
      editor={editor}
      tippyOptions={{
        duration: 100,
        placement: "bottom-start",
      }}
      className="floating-menu"
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
    </FloatingMenu>
  );
}
