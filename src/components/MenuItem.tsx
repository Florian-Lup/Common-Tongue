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

  const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault(); // Prevent focus on mouse down
  };

  const handleTouchEnd = () => {
    if (buttonRef.current) {
      buttonRef.current.blur(); // Remove focus after touch
    }
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent default touch behavior
  };

  return (
    <button
      ref={buttonRef}
      className={`menu-item${isActive && isActive() ? ' is-active' : ''}`}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onTouchEnd={handleTouchEnd}
      onTouchStart={handleTouchStart}
      title={title}
    >
      <svg className="remix">
        <use xlinkHref={`${remixiconUrl}#ri-${icon}`} />
      </svg>
    </button>
  );
};

export default MenuItem;
