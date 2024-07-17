import { ChevronRightIcon } from '@navikt/aksel-icons';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { Avatar } from '../Avatar';
import { MenuItem } from './MenuItem';
import { toTitleCase } from './NavigationDropdownMenu';
import styles from './userInfo.module.css';

interface UserInfoProps {
  name: string;
  companyName?: string;
  onClick: () => void;
}

export const UserInfo = ({ name, companyName, onClick }: UserInfoProps) => {
  const { t } = useTranslation();
  const companyNameTitleCase = toTitleCase(companyName);
  const nameTitleCase = toTitleCase(name);
  return (
    <MenuItem
      leftContent={
        <div
          className={cx(styles.menuColumn, styles.menuColumnLeft)}
          title={name}
          onClick={onClick}
          onKeyUp={onClick}
          role="button"
          tabIndex={0}
        >
          <Avatar name={name} companyName={companyNameTitleCase} />
          <div>
            <div className={styles.primaryName}>{companyNameTitleCase || nameTitleCase}</div>
            <div className={styles.secondaryName}>{companyNameTitleCase ? nameTitleCase : t('word.private')}</div>
          </div>
        </div>
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
      fullWidth
    />
  );
};
