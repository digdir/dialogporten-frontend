import { NavigationDropdownSubMenuProfile } from './NavigationDropdownSubMenuProfile';
import { NavigationDropdownSubMenuInbox } from './NavigationDropdownSubMenuInbox';

export type SubMenuSelection = 'none' | 'profile' | 'inbox' | 'access' | 'settings' | 'help' | 'all_services';

export interface DropdownSubMenuProps {
  showDropdownSubMenu?: SubMenuSelection;
  onClose: () => void;
  onBack: () => void;
}

export const NavigationDropdownSubMenu: React.FC<DropdownSubMenuProps> = ({ showDropdownSubMenu, onClose, onBack }) => {
  if (showDropdownSubMenu === 'profile') return <NavigationDropdownSubMenuProfile onClose={onClose} onBack={onBack} />;
  if (showDropdownSubMenu === 'inbox') return <NavigationDropdownSubMenuInbox onClose={onClose} onBack={onBack} />;
  return null;
};
