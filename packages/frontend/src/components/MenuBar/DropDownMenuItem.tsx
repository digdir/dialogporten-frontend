import styles from './menubar.module.css';
import { ChevronRightIcon } from '@navikt/aksel-icons';
import cx from 'classnames';

interface DropDownMenuItemProps {
  displayText: string,
  label: string,
  icon: React.ReactNode,
  path?: string,
  onClick?: () => void,
  count?: number,
  onClose?: () => void
}

export const DropDownMenuItem = ({ displayText, label, icon, path, onClick, count, onClose }: DropDownMenuItemProps) => {
  const renderDropDownMenuItem = () => <div className={styles.sidebarMenuItem} title={label}>
    <div className={styles.iconAndText}>
      <span
        className={cx(styles.icon)}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span className={styles.displayText}>{displayText}</span>
    </div>
    <div className={styles.counterAndIcon}>
      {count ? <span className={styles.menuItemCounter}>{count}</span> : <ChevronRightIcon className={styles.arrowIcon} />}
    </div>
  </div>

  if (path) return (
    <li className={styles.menuItem}>
      <a href={path} className={styles.link} onClick={onClose}>
        {renderDropDownMenuItem()}
      </a>
    </li>
  )

  if (onClick) return (
    <li className={styles.menuItem} onClick={() => {
      onClick?.()
      // onClose?.()
    }} >
      {renderDropDownMenuItem()}
    </li>
  )

  return <></>
}

