// MenuItem.jsx
import './MenuItem.scss';
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg';

export default function MenuItem ({
  icon, title, action, isActive = null,
}: {icon?: string, title?: string, action?: () => void, isActive?: (() => boolean) | null } ) {
  
  const handleClick = (e: { currentTarget: { blur: () => void; }; }) => {
    if (action) {
      action();
    }
    // Remove focus after click
    e.currentTarget.blur();
  };

  return (
    <button
      className={`menu-item${isActive && isActive() ? ' is-active' : ''}`}
      onClick={handleClick}
      title={title}
      type="button" // Ensure it's a button type to prevent unintended form submissions
    >
      <svg className="remix">
        <use xlinkHref={`${remixiconUrl}#ri-${icon}`}/>
      </svg>
    </button>
  );
}
