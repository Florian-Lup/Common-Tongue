// EditorNodes.tsx

import { Editor } from "@tiptap/react";
import { FloatingMenu } from "@tiptap/react";
import remixiconUrl from "remixicon/fonts/remixicon.symbol.svg";
import "../../styles/editor/MarksNodes.scss";

// A floating menu component that provides block-level formatting options
// Appears when the cursor is at the beginning of a block

interface MenuItemProps {
  icon?: string; // Remix icon name
  title?: string; // Tooltip text
  action?: () => void; // Click handler
  isActive?: () => boolean; // Whether the block format is currently active
}

export default function EditorNodes({ editor }: { editor: Editor }) {
  if (!editor) {
    return null;
  }

  // Define available block formatting options
  const items: MenuItemProps[] = [
    // Headings (H1, H2, H3)
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
    // Paragraph
    {
      icon: "paragraph",
      title: "Paragraph",
      action: () => editor.chain().focus().setParagraph().run(),
      isActive: () => editor.isActive("paragraph"),
    },
    // Lists (bullet and ordered)
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
    // Render floating menu at the start of blocks
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
