import { ChevronRightIcon } from '@navikt/aksel-icons';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { Avatar, type AvatarProfile } from '../Avatar';
import { MenuItem } from '../MenuBar';
import styles from './userInfo.module.css';

interface UserInfoProps {
  name: string;
  profile: AvatarProfile;
  onClick: () => void;
}

export const UserInfo = ({ name, profile, onClick }: UserInfoProps) => {
  const { t } = useTranslation();
  return (
    <MenuItem
      leftContent={
        <MenuItem.LeftContent
          className={cx(styles.menuColumn, styles.menuColumnLeft)}
          title={name}
          onClick={onClick}
          onKeyUp={onClick}
          role="button"
          tabIndex={0}
        >
          <Avatar name={name} profile={profile} />
          <div className={styles.primaryName}>{name}</div>
        </MenuItem.LeftContent>
      }
      rightContent={
        <div
          className={cx(styles.menuColumn, styles.menuColumnRight)}
          onClick={onClick}
          onKeyUp={onClick}
          role="button"
          tabIndex={0}
        >
          <span className={styles.wordChange}>{t('word.change')}</span>
          <ChevronRightIcon className={styles.arrowIcon} />
        </div>
      }
      isWhiteBackground
    />
  );
};
