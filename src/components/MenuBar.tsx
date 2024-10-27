import "./MenuBar.scss";
import type { Editor } from "@tiptap/react";

import { Fragment } from "react";

import MenuItem from "./MenuItem.jsx";

import validator from "validator";

export default function MenuBar({ editor }: { editor: Editor }) {
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
        // Check if the text already has the red color, and unset it if true
        if (editor.isActive("textStyle", { color: "#fb7185" })) {
          editor.chain().focus().unsetColor().run(); // Unset the color (removes inline style)
        } else {
          editor.chain().focus().setColor("#fb7185").run(); // Set the color using inline style
        }
      },
      isActive: () => editor.isActive("textStyle", { color: "#fb7185" }), // Check if color is active
    },
    {
      icon: "mark-pen-line", // Use the highlight icon
      title: "Highlight",
      action: () => {
        // Check if the custom highlight color is already applied
        if (editor.isActive("highlight", { color: "#fdba74" })) {
          // Unset the highlight if the color is active
          editor.chain().focus().unsetHighlight().run();
        } else {
          // Set the highlight with the custom color #fdba74
          editor.chain().focus().setHighlight({ color: "#fdba74" }).run();
        }
      },
      isActive: () => editor.isActive("highlight", { color: "#fdba74" }), // Check if the custom color is active
    },

    {
      type: "divider",
    },
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
      icon: "list-check-2",
      title: "Task List",
      action: () => editor.chain().focus().toggleTaskList().run(),
      isActive: () => editor.isActive("taskList"),
    },
    {
      type: "divider",
    },
    {
      icon: "link", // Use the Remix Icon for links
      title: "Toggle Link",
      action: () => {
        const { from, to } = editor.state.selection; // Get the selection range

        // Check if text is selected
        if (from === to) {
          alert("Please select some text to link.");
          return;
        }

        // Check if there's an existing link on the selected text
        const hasLink = editor.isActive("link");
        const previousUrl = editor.getAttributes("link").href;

        if (hasLink) {
          // If there's already a link, remove the link and clear formatting (blue color, underline)
          editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .unsetLink() // Remove the link
            .unsetMark("textStyle") // Remove blue color
            .unsetMark("underline") // Remove underline
            .run();
        } else {
          // Prompt user for a URL if no link exists
          const url = window.prompt("Enter the URL:", previousUrl || "");

          if (url === null || url === "") {
            return; // If URL input is empty or canceled, do nothing
          }

          // Validate the URL
          if (!validator.isURL(url)) {
            alert("Invalid URL. Please enter a valid link.");
            return;
          }

          // Apply the link, blue color, and underline to the selected text
          editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .toggleLink({ href: url, target: "_blank" }) // Apply link with target="_blank"
            .setMark("textStyle", { color: "#60a5fa" }) // Set text color to blue
            .setMark("underline") // Set underline
            .run();
        }

        // Move the cursor to the end of the linked text and clear all marks
        editor
          .chain()
          .focus()
          .setTextSelection(to + 1) // Move the cursor after the link
          .unsetMark("link") // Remove the link from the current position
          .unsetMark("textStyle") // Remove blue color
          .unsetMark("underline") // Remove underline
          .run();
      },
      isActive: () => editor.isActive("link"), // Highlight button if a link is active
    },
    {
      icon: "code-box-line",
      title: "Code Block",
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor.isActive("codeBlock"),
    },
    {
      icon: "code-view",
      title: "Code",
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: () => editor.isActive("code"),
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
    {
      icon: "text-wrap",
      title: "Hard Break",
      action: () => editor.chain().focus().setHardBreak().run(),
    },
    {
      type: "divider",
    },
    {
      icon: "clipboard-line", // Correct icon class for Remix clipboard icon
      title: "Copy Text", // Tooltip title
      action: () => {
        const editorText = editor.getText(); // Get the text content from the editor
        navigator.clipboard
          .writeText(editorText)
          .then(() => alert("Text copied to clipboard!"))
          .catch((err) => console.error("Failed to copy text: ", err));
      },
      isActive: null, // Copy button doesn’t need an active state
    },
    {
      icon: "delete-bin-line", // Use the Remix Icon for the delete bin
      title: "Delete Text",
      action: () => {
        // Clear the editor's content
        editor.chain().focus().clearContent().run();
      },
      isActive: null, // No active state needed for delete
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

  return (
    <div className="editor__header">
      <div className="menu-bar">
        {items.map((item, index) => (
          <Fragment key={index}>
            {item.type === "divider" ? (
              <div className="divider" />
            ) : (
              <MenuItem {...item} />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
