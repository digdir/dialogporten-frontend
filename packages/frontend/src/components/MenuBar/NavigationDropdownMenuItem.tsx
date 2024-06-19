import styles from './navigationMenu.module.css';
import { ChevronRightIcon, ExternalLinkIcon } from '@navikt/aksel-icons';

interface DropDownMenuItemProps {
  displayText: string,
  label: string,
  icon: React.ReactNode,
  path?: string,
  onClick?: () => void,
  count?: number,
  onClose?: () => void
  isExternalLink?: boolean
}

export const NavigationDropdownMenuItem = ({ displayText, label, icon, path, onClick, count, onClose, isExternalLink }: DropDownMenuItemProps) => {
  const renderDropDownMenuItem = () =>
    <div className={styles.sidebarMenuItem} title={label}>
      <div className={styles.iconAndText}>
        <span
          className={styles.icon}
          aria-hidden="true"
        >
          {icon}
        </span>
        <span className={styles.displayText}>{displayText}</span>
      </div>
      <div className={styles.counterAndIcon}>
        {isExternalLink ? <ExternalLinkIcon className={styles.arrowIcon} /> : count ? <span className={styles.menuItemCounter}>{count}</span> : count !== 0 && <ChevronRightIcon className={styles.arrowIcon} />}
      </div>
    </div>

  if (path) {
    return (
      <li className={styles.menuItem}>
        <a href={path} className={styles.link} onClick={onClose} target={isExternalLink ? '_blank' : '_self'}>
          {renderDropDownMenuItem()}
        </a>
      </li>
    )
  }

  if (onClick) {
    return (
      <li className={styles.menuItem} onClick={onClick} >
        {renderDropDownMenuItem()}
      </li>
    )
  }

  return null
}

