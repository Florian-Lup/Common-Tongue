// MenuItem.tsx

import './MenuItem.scss';
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg';

interface MenuItemProps {
  icon: string;
  title: string;
  action: () => void;
  isActive?: () => boolean;
  onMenuItemClick?: () => void;
}

export default function MenuItem({
  icon,
  title,
  action,
  isActive = null,
  onMenuItemClick,
}: MenuItemProps) {
  return (
    <button
      className={`menu-item${isActive && isActive() ? ' is-active' : ''}`}
      onClick={() => {
        action();
        if (onMenuItemClick) onMenuItemClick();
      }}
      title={title}
    >
      <svg className="remix">
        <use xlinkHref={`${remixiconUrl}#ri-${icon}`} />
      </svg>
    </button>
  );
}
