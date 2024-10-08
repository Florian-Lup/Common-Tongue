// MenuItem.tsx
import React from 'react';
import './MenuItem.scss';
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg';

interface MenuItemProps {
  icon?: string;
  title?: string;
  action?: () => void;
  isActive?: (() => boolean) | null;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, title, action, isActive = null }) => {
  const handleClick = () => {
    if (action) {
      action();
    }
  };

  return (
    <button
      className={`menu-item${isActive && isActive() ? ' is-active' : ''}`}
      onClick={handleClick}
      title={title}
      role="menuitem"
    >
      {icon && (
        <svg className="remix">
          <use xlinkHref={`${remixiconUrl}#ri-${icon}`} />
        </svg>
      )}
      <span className="menu-item__title">{title}</span>
    </button>
  );
};

export default MenuItem;
