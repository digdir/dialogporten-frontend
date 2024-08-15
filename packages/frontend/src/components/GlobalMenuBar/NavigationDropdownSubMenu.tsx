import { NavigationDropdownSubMenuInbox } from './NavigationDropdownSubMenuInbox.tsx';
import { NavigationDropdownSubMenuProfile } from './NavigationDropdownSubMenuProfile.tsx';

export type SubMenuSelection = 'none' | 'profile' | 'inbox' | 'access' | 'settings' | 'help' | 'all_services';

export interface DropdownSubMenuProps {
  showDropdownSubMenu?: SubMenuSelection;
  onClose: () => void;
  onBack: () => void;
}

export const NavigationDropdownSubMenu: React.FC<DropdownSubMenuProps> = ({ showDropdownSubMenu, onClose, onBack }) => {
  switch (showDropdownSubMenu) {
    case 'profile':
      return <NavigationDropdownSubMenuProfile onClose={onClose} onBack={onBack} />;
    case 'inbox':
      return <NavigationDropdownSubMenuInbox onClose={onClose} onBack={onBack} />;
    default:
      return null;
  }
};
