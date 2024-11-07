import { Avatar, type AvatarType } from '@altinn/altinn-components';
import { ChevronRightIcon } from '@navikt/aksel-icons';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { MenuItem } from '../MenuBar';
import styles from './userInfo.module.css';

interface UserInfoProps {
  name: string;
  profile: AvatarType;
  onClick: () => void;
}

export const UserInfo = ({ name, profile, onClick }: UserInfoProps) => {
  const { t } = useTranslation();
  return (
    <MenuItem
      dataTestId={'user-info'}
      leftContent={
        <MenuItem.LeftContent className={cx(styles.menuColumn, styles.menuColumnLeft)} title={name} onClick={onClick}>
          <Avatar name={name} type={profile} />
          <div className={styles.primaryName}>{name}</div>
        </MenuItem.LeftContent>
      }
      rightContent={
        <button
          type="button"
          className={cx(styles.resetButton, styles.menuColumn, styles.menuColumnRight)}
          onClick={onClick}
        >
          <span className={styles.wordChange}>{t('word.change')}</span>
          <ChevronRightIcon className={styles.arrowIcon} />
        </button>
      }
      isWhiteBackground
    />
  );
};
