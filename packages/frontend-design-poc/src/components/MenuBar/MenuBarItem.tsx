import styles from './menubar.module.css';

export type MenuBarItemProps = {
  title: string;
  href: string;
  icon?: JSX.Element;
};

export type MenuBarDropdownProps = {
  show?: boolean;

  items: MenuBarItemProps[];
};

export const MenuBarDropdown: React.FC<MenuBarDropdownProps> = ({ show, items }) => {
  if (show)
    return (
      <div className={styles.menuItems}>
        {items.map(({ href, icon, title }) => (
          <a href={href} className={styles.menuItem}>
            {icon && <div>{icon}</div>}
            <p>{title}</p>
          </a>
        ))}
      </div>
    );

  return null;
};
