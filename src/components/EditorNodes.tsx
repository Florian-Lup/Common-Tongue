// Nodes.tsx
import { FloatingMenu, Editor } from '@tiptap/react';
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg';
import "./MarksNodes.scss";

interface EditorNodesProps {
  editor: Editor;
}

export default function EditorNodes({ editor }: EditorNodesProps) {
  if (!editor) {
    return null;
  }

  const items = [
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
    {
      icon: "code-box-line",
      title: "Code Block",
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor.isActive("codeBlock"),
    },
    {
      icon: "double-quotes-l",
      title: "Blockquote",
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive("blockquote"),
    },
    {
      icon: "separator",
      title: "Horizontal Rule",
      action: () => editor.chain().focus().setHorizontalRule().run(),
    },
  ];

  return (
    <FloatingMenu
      editor={editor}
      tippyOptions={{
        duration: 100,
        placement: 'bottom-start',
      }}
    >
      <div className="floating-menu">
        {items.map((item, index) => (
          <button
            key={index}
            className={`menu-item${item.isActive && item.isActive() ? ' is-active' : ''}`}
            onClick={item.action}
            title={item.title}
          >
            <svg className="remix">
              <use xlinkHref={`${remixiconUrl}#ri-${item.icon}`} />
            </svg>
          </button>
        ))}
      </div>
    </FloatingMenu>
  );
}
