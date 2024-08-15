import { ChevronRightIcon, ExternalLinkIcon } from '@navikt/aksel-icons';
import cx from 'classnames';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Badge } from '../Badge';
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
  largeText?: boolean;
  smallText?: boolean;
  classNames?: string;
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
  largeText,
  classNames,
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
        largeText,
      }}
    />
  );
  if (path) {
    return (
      <Link className={styles.isLink} to={path} onClick={onClose} target={isExternalLink ? '_blank' : '_self'}>
        <li className={cx(styles.liItem, classNames)}>{RenderItem}</li>
      </Link>
    );
  }

  if (onClick) {
    return (
      <li className={cx(styles.isLink, styles.liItem, classNames)} onClick={onClick} onKeyUp={onClick}>
        {RenderItem}
      </li>
    );
  }

  if (leftContent || rightContent) {
    return <li className={styles.liItem}>{RenderItem}</li>;
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
  largeText,
}: DropDownMenuItemProps) => {
  return (
    <div
      className={cx(styles.menuItem, classNames, {
        [styles.whiteBackgroundWhenActive]: isActive && isWhiteBackground,
        [styles.greyBackgroundWhenActive]: isActive && !isWhiteBackground,
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
                [styles.greyBackgroundWhenActive]: isActive && isWhiteBackground && !isInbox,
              })}
              aria-hidden="true"
            >
              {icon}
            </div>
            <div className={cx(styles.displayText, { [styles.largeText]: largeText })}>{displayText}</div>
          </>
        )}
      </div>
      {rightContent}
      {(path || onClick) && (
        <div className={styles.rightContent}>
          {isExternalLink ? (
            <ExternalLinkIcon className={styles.arrowIcon} />
          ) : count ? (
            <div className={styles.badgeWrapper}>
              <Badge label={count} variant={isInbox ? 'strong' : 'neutral'} />
            </div>
          ) : (
            count !== 0 && <ChevronRightIcon className={styles.arrowIcon} />
          )}
        </div>
      )}
    </div>
  );
};
