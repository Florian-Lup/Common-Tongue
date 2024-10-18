// components/MenuItem.tsx
import React from 'react';
import './MenuItem.scss';
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg';

interface MenuItemProps {
  icon?: string;
  title?: string;
  action?: () => void;
  isActive?: () => boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, title, action, isActive }) => {
  const active = isActive ? isActive() : false;

  return (
    <button
      className={`menu-item${active ? ' is-active' : ''}`}
      onClick={action}
      title={title}
      type="button"
    >
      {icon && (
        <svg className="remix">
          <use xlinkHref={`${remixiconUrl}#ri-${icon}`} />
        </svg>
      )}
    </button>
  );
};

export default React.memo(MenuItem);
