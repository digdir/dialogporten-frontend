import { HorizontalLine } from '../HorizontalLine';
import styles from './search.module.css';

interface SearchDropdownItemProps {
  children: React.ReactNode;
  horizontalLine?: boolean;
  onClick?: () => void;
}

export const SearchDropdownItem: React.FC<SearchDropdownItemProps> = ({ children, horizontalLine, onClick }) => {
  return (
    <>
      <li className={styles.menuItem} onClick={onClick} onKeyUp={onClick}>
        {children}
      </li>
      {horizontalLine && <HorizontalLine />}
    </>
  );
};
