// Marks.tsx
import { BubbleMenu, Editor } from '@tiptap/react';
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg';
import "./MarksNodes.scss";

interface EditorMarksProps {
  editor: Editor;
}

export default function EditorMarks({ editor }: EditorMarksProps) {
  if (!editor) {
    return null;
  }

  const items = [
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
    {
      icon: "code-view",
      title: "Code",
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: () => editor.isActive("code"),
    },
    {
      icon: "format-clear",
      title: "Clear Format",
      action: () => editor.chain().focus().clearNodes().unsetAllMarks().run(),
    },
    {
      icon: "clipboard-line", 
      title: "Copy Text",
      action: () => {
        const { from, to } = editor.state.selection;

        // Check if there is a text selection
        if (from === to) {
          // No text selected; do nothing
          return;
        }

        // Extract the selected text
        const selectedText = editor.state.doc.textBetween(from, to, "\n");

        // Copy the selected text to the clipboard
        navigator.clipboard
          .writeText(selectedText)
          .catch((err) => console.error("Failed to copy text: ", err))
          .finally(() => {
            // Refocus the editor after copying
            editor.chain().focus().run();
          });
      },
      isActive: null,
    },

  ];

  return (
    <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
      <div className="bubble-menu">
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
    </BubbleMenu>
  );
}
