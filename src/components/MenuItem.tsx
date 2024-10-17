// MenuItem.jsx
import React, { useState, memo } from 'react';
import './MenuItem.scss';
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg';

const MenuItem = memo(function MenuItem ({
  icon, title, action, isActive = null,
}: {icon?: string, title?: string, action?: () => void, isActive?: (() => boolean) | null } ) {
  const [isDebouncing, setIsDebouncing] = useState(false);

  const handleClick = () => {
    if (isDebouncing) return;

    if (action) action();

    setIsDebouncing(true);
    setTimeout(() => setIsDebouncing(false), 300); // 300ms debounce
  };

  return (
    <button
      className={`menu-item${isActive && isActive() ? ' is-active' : ''}`}
      onClick={handleClick}
      title={title}
      aria-pressed={isActive && isActive()}
      disabled={isDebouncing}
    >
      <svg className="remix">
        <use href={`${remixiconUrl}#ri-${icon}`} />
      </svg>
    </button>
  );
});

export default MenuItem;
