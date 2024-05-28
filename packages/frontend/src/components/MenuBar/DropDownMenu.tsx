import { useTranslation } from "react-i18next";
import { useWindowSize } from "../../../utils/useWindowSize";
import { Avatar } from "../Avatar";
import styles from './menubar.module.css';
import { Footer, SidebarItem } from '..';
import { ChevronRightIcon, CogIcon, InboxFillIcon, MenuGridIcon, PersonChatIcon } from '@navikt/aksel-icons';
import { Button } from '@digdir/designsystemet-react';
import { Hr } from ".";
import cx from 'classnames';

interface DropdownMenuProps {
  showDropdownMenu: boolean,
  name: string,
  companyName?: string
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ showDropdownMenu, name, companyName }) => {
  const { t } = useTranslation();
  const { isMobile } = useWindowSize();
  if (!showDropdownMenu) return <></>;

	const onLogoutClick = () => {
		(window as Window).location = `/api/logout`;
	};

  return (
    <div className={styles.menuItems}>
      <ul className={styles.menuList}>
        <li className={styles.menuItem}>
          <div className={cx(styles.menuProfileInfo)}>
            <div className={styles.menuColumn} >
              <Avatar name={name} companyName={companyName} darkCircle />
              <div>
                <div className={styles.primaryName}>{companyName || name}</div>
                <div className={styles.secondaryName}>{companyName ? name : t('word.private')}</div>
              </div>
            </div>
            <div className={styles.menuColumn} >
              {t('word.change')}<ChevronRightIcon className={styles.arrowIcon} />
            </div>
          </div>
          <Hr />
        </li>
        <li className={styles.menuItem}>
          <SidebarItem
            displayText={t('inbox.title')}
            label={t('link.goToInbox')}
            icon={<InboxFillIcon />}
            count={3}
            path="/inbox"
            isInbox
            className={styles.sidebarMenuItem}
            type="menuItem"
          />
        </li>
        <li className={styles.menuItem}>
          <SidebarItem
            displayText={t("menuBar.all_services")}
            label={t('link.goToAllServices')}
            icon={<MenuGridIcon />}
            path="/services"
            className={styles.sidebarMenuItem}
            type="menuItem"
          />
        </li>
        <li className={styles.menuItem}>
          <SidebarItem
            displayText={t("sidebar.settings")}
            label={t('link.goToSettings')}
            icon={<CogIcon />}
            path="/services"
            className={styles.sidebarMenuItem}
            type="menuItem"
          />
        </li>
        <Hr />
        <li className={styles.menuItem}>
          <SidebarItem
            displayText="Få hjelp på chat"
            label="Trykk her for å gå til alle tjenester"
            icon={<PersonChatIcon />}
            path="/services"
            className={styles.sidebarMenuItem}
            type="menuItem"
          />
        </li>
        <Hr />
        <li className={styles.menuItem}>
          <Button variant="secondary" className={styles.logoutButton} onClick={onLogoutClick}>
            Logg ut
          </Button>
        </li>
        {isMobile && <Footer />}
      </ul>
    </div>
  )
}
