import { DropdownSubMenuProfile } from "./DropDownSubMenuProfile";
import { DropdownSubMenuInbox } from "./DropDownSubMenuInbox";

export type SubeMenuSelection = 'none' | 'profile' | 'inbox' | 'access' | 'settings' | 'help' | 'all_services'

export interface DropdownSubMenuProps {
  showDropdownSubMenu?: SubeMenuSelection,
  onClose: () => void
  onBack: () => void
}

export const DropdownSubMenu: React.FC<DropdownSubMenuProps> = ({ showDropdownSubMenu, onClose, onBack }) => {
  if (showDropdownSubMenu === 'profile') return <DropdownSubMenuProfile onClose={onClose} onBack={onBack} />
  if (showDropdownSubMenu === 'inbox') return <DropdownSubMenuInbox onClose={onClose} onBack={onBack} />
  return <></>;
}
