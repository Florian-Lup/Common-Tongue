import './MenuItem.scss';
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg';

export default function MenuItem({
  icon,
  title,
  action,
  isActive = null,
  onMenuItemClick,
}: {
  icon: string;
  title: string;
  action: () => void;
  isActive?: (() => boolean) | null;
  onMenuItemClick?: () => void;
}) {
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
