import { useTranslation } from "react-i18next";
import { useWindowSize } from "../../../utils/useWindowSize";
import { Avatar } from "../Avatar";
import styles from './menubar.module.css';
import { Footer } from '..';
import { ChevronRightIcon, CogIcon, InboxFillIcon, MenuGridIcon, PersonChatIcon } from '@navikt/aksel-icons';
import { Button } from '@digdir/designsystemet-react';
import { Hr } from ".";
import cx from 'classnames';
import { useState } from "react";
import { DropdownSubMenu, SubeMenuSelection } from "./DropDownSubMenu";
import { DropDownMenuItem } from "./DropDownMenuItem";

interface DropdownMenuProps {
  showDropdownMenu: boolean,
  name: string,
  companyName?: string
  onClose: () => void
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ showDropdownMenu, name, companyName, onClose }) => {
  const { t } = useTranslation();
  const { isMobile } = useWindowSize();
  const [showSubMenu, setShowSubMenu] = useState<SubeMenuSelection>('none')

  const handleClose = () => {
    onClose?.()
    setShowSubMenu('none')
  }

  if (showSubMenu !== 'none') return (
    <DropdownSubMenu showDropdownSubMenu={showSubMenu} onClose={handleClose} onBack={() => setShowSubMenu('none')} />
  )
  if (!showDropdownMenu) return <></>;


  return (
    <div className={styles.menuItems}>
      <ul className={styles.menuList}>
        <li className={styles.menuItem}>
          <div className={cx(styles.sidebarMenuItem)}>
            <div className={styles.menuColumn} onClick={() => setShowSubMenu('profile')} role="button" tabIndex={0}>
              <Avatar name={name} companyName={companyName} darkCircle />
              <div>
                <div className={styles.primaryName}>{companyName || name}</div>
                <div className={styles.secondaryName}>{companyName ? name : t('word.private')}</div>
              </div>
            </div>
            <div role="button" tabIndex={0} className={styles.menuColumn}  >
              {t('word.change')}<ChevronRightIcon className={styles.arrowIcon} />
            </div>
          </div>
          <Hr />
        </li>
        <DropDownMenuItem displayText={t('sidebar.inbox')} label={t('sidebar.inbox.label')} icon={<InboxFillIcon />} onClose={handleClose} onClick={() => setShowSubMenu('inbox')} />
        <DropDownMenuItem displayText={t("menuBar.all_services")} label={t('link.goToAllServices')} icon={<MenuGridIcon />} onClose={handleClose} onClick={() => setShowSubMenu('all_services')} />
        <DropDownMenuItem displayText={t("sidebar.settings")} label={t('link.goToSettings')} icon={<CogIcon />} onClose={handleClose} onClick={() => setShowSubMenu('settings')} />
        <DropDownMenuItem displayText={t("menuBar.chat")} label={t('menuBar.chat.label')} icon={<PersonChatIcon />} onClick={() => setShowSubMenu('help')} />

        <Hr />
        <MenuLogoutButton />
        {isMobile && <Footer />}
      </ul>
    </div>
  )
}

export const MenuLogoutButton = () => {
  const { t } = useTranslation();
  return (
    <li className={styles.menuItem}>
      <Button variant="secondary" className={styles.logoutButton} onClick={() => (window as Window).location = `/api/logout`}>
        {t('word.log_out')}
      </Button>
    </li>
  )
}
