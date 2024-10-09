// DropdownMenu.tsx
import React, { useState, useEffect, useRef } from 'react';
import './DropdownMenu.scss';
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg';
import MenuItem from './MenuItem';

interface MenuItemProps {
  icon?: string;
  title?: string;
  action?: () => void;
  isActive?: (() => boolean) | null;
}

interface DropdownMenuProps {
  title: string;
  icon: string;
  items: MenuItemProps[];
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ title, icon, items }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setOpen((prevOpen) => !prevOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // Handle menu item click to close dropdown
  const handleMenuItemClick = (action?: () => void) => {
    if (action) {
      action();
    }
    setOpen(false);
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div
      className={`dropdown-menu ${open ? 'open' : ''}`}
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
      tabIndex={0} // Make the div focusable to capture keyboard events
    >
      <button
        className="dropdown-toggle"
        onClick={toggleDropdown}
        title={title}
        // Removed ARIA attributes:
        // aria-haspopup="true"
        // aria-expanded={open}
      >
        <svg className="remix">
          <use xlinkHref={`${remixiconUrl}#ri-${icon}`} />
        </svg>
        <svg className="remix dropdown-arrow">
          <use xlinkHref={`${remixiconUrl}#ri-arrow-down-s-line`} />
        </svg>
      </button>
      
      {/* Always render the dropdown-content */}
      <div className="dropdown-content">
        {items.map((item, index) => (
          <MenuItem
            key={index}
            {...item}
            action={() => handleMenuItemClick(item.action)}
          />
        ))}
      </div>
    </div>
  );
};

export default DropdownMenu;
