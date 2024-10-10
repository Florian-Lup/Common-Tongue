import './MenuBar.scss';
import type { Editor } from '@tiptap/react';
import DropdownMenu from './DropdownMenu';
import validator from 'validator';

export default function MenuBar({ editor }: { editor: Editor }) {
  const groups = [
    // ... existing groups ...
  ];

  return (
    <div className="menu-bar">
      {groups.map((group, index) => (
        <DropdownMenu key={index} title={group.title} icon={group.icon} items={group.items} />
      ))}
    </div>
  );
}

.divider {
  background-color: rgba(#fff, 0.25);
  height: 1.25rem;
  margin-left: 0.5rem;
  margin-right: 0.75rem;
  width: 1px;
}

/* MenuItem.scss */
.menu-item {
  /* ... existing styles ... */
}
