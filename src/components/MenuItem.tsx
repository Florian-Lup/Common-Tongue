// MenuItem.tsx
import React, { useRef } from 'react';
import './MenuItem.scss';
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg';

interface MenuItemProps {
  icon?: string;
  title?: string;
  action?: () => void;
  isActive?: (() => boolean) | null;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, title, action, isActive = null }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    if (action) {
      action();
    }
    if (buttonRef.current) {
      buttonRef.current.blur(); // Remove focus after click
    }
  };

  return (
    <button
      ref={buttonRef}
      className={`menu-item${isActive && isActive() ? ' is-active' : ''}`}
      onClick={handleClick}
      title={title}
    >
      <svg className="remix">
        <use xlinkHref={`${remixiconUrl}#ri-${icon}`} />
      </svg>
    </button>
  );
};

export default MenuItem;
