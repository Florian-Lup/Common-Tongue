import './MenuBar.scss';
import type { Editor } from '@tiptap/react';
import DropdownMenu from './DropdownMenu';
import validator from 'validator';

export default function MenuBar({ editor }: { editor: Editor }) {
  const groups = [
    {
      title: 'Formatting',
      icon: 'font-size',
      items: [
        {
          icon: 'bold',
          title: 'Bold',
          action: () => editor.chain().focus().toggleBold().run(),
          isActive: () => editor.isActive('bold'),
        },
        {
          icon: 'italic',
          title: 'Italic',
          action: () => editor.chain().focus().toggleItalic().run(),
          isActive: () => editor.isActive('italic'),
        },
        {
          icon: 'underline',
          title: 'Underline',
          action: () => editor.chain().focus().toggleUnderline().run(),
          isActive: () => editor.isActive('underline'),
        },
        {
          icon: 'strikethrough',
          title: 'Strike',
          action: () => editor.chain().focus().toggleStrike().run(),
          isActive: () => editor.isActive('strike'),
        },
        {
          icon: 'palette-line',
          title: 'Text Color',
          action: () => {
            if (editor.isActive('textStyle', { color: '#fb7185' })) {
              editor.chain().focus().unsetColor().run();
            } else {
              editor.chain().focus().setColor('#fb7185').run();
            }
          },
          isActive: () => editor.isActive('textStyle', { color: '#fb7185' }),
        },
        {
          icon: 'mark-pen-line',
          title: 'Highlight',
          action: () => {
            if (editor.isActive('highlight', { color: '#fdba74' })) {
              editor.chain().focus().unsetHighlight().run();
            } else {
              editor.chain().focus().setHighlight({ color: '#fdba74' }).run();
            }
          },
          isActive: () => editor.isActive('highlight', { color: '#fdba74' }),
        },
      ],
    },
    {
      title: 'Hierarchy',
      icon: 'list-settings-line',
      items: [
        {
          icon: 'h-1',
          title: 'Heading 1',
          action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
          isActive: () => editor.isActive('heading', { level: 1 }),
        },
        {
          icon: 'h-2',
          title: 'Heading 2',
          action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
          isActive: () => editor.isActive('heading', { level: 2 }),
        },
        {
          icon: 'paragraph',
          title: 'Paragraph',
          action: () => editor.chain().focus().setParagraph().run(),
          isActive: () => editor.isActive('paragraph'),
        },
        {
          icon: 'list-unordered',
          title: 'Bullet List',
          action: () => editor.chain().focus().toggleBulletList().run(),
          isActive: () => editor.isActive('bulletList'),
        },
        {
          icon: 'list-ordered',
          title: 'Ordered List',
          action: () => editor.chain().focus().toggleOrderedList().run(),
          isActive: () => editor.isActive('orderedList'),
        },
        {
          icon: 'list-check-2',
          title: 'Task List',
          action: () => editor.chain().focus().toggleTaskList().run(),
          isActive: () => editor.isActive('taskList'),
        },
      ],
    },
    {
      title: 'Insert',
      icon: 'page-separator',
      items: [
        {
          icon: 'link',
          title: 'Link',
          action: () => {
            const { from, to } = editor.state.selection;
            if (from === to) {
              alert('Please select some text to link.');
              return;
            }
            const hasLink = editor.isActive('link');
            const previousUrl = editor.getAttributes('link').href;

            if (hasLink) {
              editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .unsetLink()
                .unsetMark('textStyle')
                .unsetMark('underline')
                .run();
            } else {
              const url = window.prompt('Enter the URL:', previousUrl || '');
              if (url === null || url === '') {
                return;
              }
              if (!validator.isURL(url)) {
                alert('Invalid URL. Please enter a valid link.');
                return;
              }
              editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .toggleLink({ href: url, target: '_blank' })
                .setMark('textStyle', { color: '#60a5fa' })
                .setMark('underline')
                .run();
            }
            editor
              .chain()
              .focus()
              .setTextSelection(to + 1)
              .unsetMark('link')
              .unsetMark('textStyle')
              .unsetMark('underline')
              .run();
          },
          isActive: () => editor.isActive('link'),
        },
        {
          icon: 'code-box-line',
          title: 'Code Block',
          action: () => editor.chain().focus().toggleCodeBlock().run(),
          isActive: () => editor.isActive('codeBlock'),
        },
        {
          icon: 'code-view',
          title: 'Code',
          action: () => editor.chain().focus().toggleCode().run(),
          isActive: () => editor.isActive('code'),
        },
        {
          icon: 'double-quotes-l',
          title: 'Blockquote',
          action: () => editor.chain().focus().toggleBlockquote().run(),
          isActive: () => editor.isActive('blockquote'),
        },
        {
          icon: 'separator',
          title: 'Horizontal Rule',
          action: () => editor.chain().focus().setHorizontalRule().run(),
          isActive: null,
        },
        {
          icon: 'text-wrap',
          title: 'Hard Break',
          action: () => editor.chain().focus().setHardBreak().run(),
          isActive: null,
        },
      ],
    },
    {
      title: 'Tools',
      icon: 'tools-line',
      items: [
        {
          icon: 'clipboard-line',
          title: 'Copy Text',
          action: () => {
            const editorText = editor.getText();
            navigator.clipboard
              .writeText(editorText)
              .then(() => alert('Text copied to clipboard!'))
              .catch((err) => console.error('Failed to copy text: ', err));
          },
          isActive: null,
        },
        {
          icon: 'delete-bin-line',
          title: 'Delete Text',
          action: () => editor.chain().focus().clearContent().run(),
          isActive: null,
        },
        {
          icon: 'format-clear',
          title: 'Clear Format',
          action: () => editor.chain().focus().clearNodes().unsetAllMarks().run(),
          isActive: null,
        },
        {
          icon: 'arrow-go-back-line',
          title: 'Undo',
          action: () => editor.chain().focus().undo().run(),
          isActive: null,
        },
        {
          icon: 'arrow-go-forward-line',
          title: 'Redo',
          action: () => editor.chain().focus().redo().run(),
          isActive: null,
        },
      ],
    },
  ];

  return (
    <div className="menu-bar">
      {groups.map((group, index) => (
        <DropdownMenu key={index} title={group.title} icon={group.icon} items={group.items} />
      ))}
    </div>
  );
}
