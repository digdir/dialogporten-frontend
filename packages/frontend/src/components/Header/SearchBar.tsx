import cx from 'classnames';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './search.module.css';
import { Backdrop } from '../Backdrop/Backdrop';
import { useSearchString } from '../Header';
import { Search } from '@digdir/designsystemet-react';
import { SearchDropdown } from './SearchDropdown';


export const SearchBar: React.FC = () => {
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);
  const { t } = useTranslation();
  const { queryClient, searchString } = useSearchString();
  const [searchValue, setSearchValue] = useState(searchString);

  const handleClose = () => {
    setShowDropdownMenu(false);
  }

  const onSearch = (value: string) => {
    queryClient.setQueryData(['search'], () => value || '');
    setShowDropdownMenu(false);
  }

  return (
    <>
      <div className={cx(styles.menuContainer, { [styles.searchbarOpen]: showDropdownMenu })}>
        <div className={styles.searchbarContainer}>
          <Search
            autoComplete='off'
            onFocus={() => setShowDropdownMenu(true)}
            size="small"
            aria-label={t('header.searchPlaceholder')}
            placeholder={t('header.searchPlaceholder')}
            className={cx(styles.searchbar, { [styles.searchbarOpen]: showDropdownMenu })}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const inputTarget = e.target as HTMLInputElement;
                onSearch(inputTarget.value);
              }
            }}
            value={searchValue}
            onClear={() => {
              setShowDropdownMenu(false);
              setSearchValue('')
            }}
          />
          <SearchDropdown showDropdownMenu={showDropdownMenu} onClose={handleClose} searchValue={searchValue || ''} onSearch={onSearch} />
        </div>
      </div>
      <Backdrop show={showDropdownMenu} onClick={handleClose} />
    </>
  );
};
