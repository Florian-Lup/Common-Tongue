// MenuItem.jsx
import React from 'react';
import './MenuItem.scss';
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg';

interface MenuItemProps {
  icon?: string;
  title?: string;
  action?: () => void;
  isActive?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  action,
  isActive = false,
}) => {
  return (
    <button
      className={`menu-item${isActive ? ' is-active' : ''}`}
      onClick={action}
      title={title}
      type="button" // Ensures the button doesn't submit forms if inside one
    >
      <svg className="remix">
        <use xlinkHref={`${remixiconUrl}#ri-${icon}`} />
      </svg>
    </button>
  );
};

export default React.memo(MenuItem); // Optimize with React.memo
