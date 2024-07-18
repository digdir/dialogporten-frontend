import { ChevronRightIcon, ExternalLinkIcon } from '@navikt/aksel-icons';
import cx from 'classnames';
import styles from './menuItem.module.css';

interface DropDownMenuItemProps {
  displayText?: string;
  label?: string;
  icon?: React.ReactNode;
  path?: string;
  onClick?: () => void;
  count?: number;
  onClose?: () => void;
  isExternalLink?: boolean;
  isActive?: boolean;
  isInbox?: boolean;
  isWhiteBackground?: boolean;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  fullWidth?: boolean;
  smallIcon?: boolean;
  smallText?: boolean;
}

export const MenuItem = ({
  displayText,
  label,
  icon,
  path,
  onClick,
  count,
  onClose,
  isExternalLink,
  isActive,
  isInbox,
  isWhiteBackground,
  leftContent,
  rightContent,
  fullWidth,
  smallIcon,
  smallText,
}: DropDownMenuItemProps) => {
  const RenderItem = (
    <RenderDropDownMenuItem
      {...{
        displayText,
        label,
        icon,
        path,
        onClick,
        count,
        isExternalLink,
        isActive,
        isInbox,
        isWhiteBackground,
        leftContent,
        rightContent,
        fullWidth,
        smallIcon,
        smallText,
      }}
    />
  );
  if (path) {
    return (
      <li>
        <a className={cx(styles.link)} href={path} onClick={onClose} target={isExternalLink ? '_blank' : '_self'}>
          {RenderItem}
        </a>
      </li>
    );
  }

  if (onClick) {
    return (
      <li onClick={onClick} onKeyUp={onClick}>
        {RenderItem}
      </li>
    );
  }

  if (leftContent || rightContent) {
    return <li>{RenderItem}</li>;
  }

  return null;
};

const RenderDropDownMenuItem = ({
  displayText,
  label,
  icon,
  path,
  onClick,
  count,
  isExternalLink,
  isActive,
  isInbox,
  isWhiteBackground,
  leftContent,
  rightContent,
  fullWidth,
  smallIcon,
  smallText,
}: DropDownMenuItemProps) => {
  return (
    <div
      className={cx(styles.menuItem, {
        [styles.whiteBackgroundWhenActive]: isActive && !isWhiteBackground,
        [styles.greyBackgroundWhenActive]: isActive && isWhiteBackground,
        [styles.fullWidth]: fullWidth,
        [styles.smallIcon]: smallIcon,
      })}
      title={label}
    >
      <div className={cx(styles.leftContent)}>
        {leftContent}
        {(path || onClick) && (
          <>
            <div
              className={cx(styles.icon, {
                [styles.isWhiteBackground]: isWhiteBackground,
                [styles.isTransparentBackground]: !isWhiteBackground,
                [styles.isInbox]: isInbox,
                [styles.greyBackgroundWhenActive]: isWhiteBackground && !isInbox,
              })}
              aria-hidden="true"
            >
              {icon}
            </div>
            <div className={cx(styles.displayText, { [styles.smallText]: smallText })}>{displayText}</div>
          </>
        )}
      </div>
      {rightContent}
      {(path || onClick) && (
        <div className={styles.rightContent}>
          {isExternalLink ? (
            <ExternalLinkIcon className={styles.arrowIcon} />
          ) : count ? (
            <span className={cx(styles.menuItemCounter, { [styles.redCounter]: isInbox })}>{count}</span>
          ) : (
            count !== 0 && <ChevronRightIcon className={styles.arrowIcon} />
          )}
        </div>
      )}
    </div>
  );
};