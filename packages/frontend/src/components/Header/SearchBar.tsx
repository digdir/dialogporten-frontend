import { Search } from '@digdir/designsystemet-react';
import cx from 'classnames';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Backdrop } from '../Backdrop';
import { useSearchString } from '../Header';
import { SearchDropdown } from './SearchDropdown';
import styles from './search.module.css';

export const SearchBar: React.FC = () => {
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchString, setSearchString } = useSearchString();
  const [searchValue, setSearchValue] = useState<string>(searchString);

  const handleClose = () => {
    setShowDropdownMenu(false);
  };

  const onClearSearch = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (newSearchParams.has('data')) {
      newSearchParams.delete('data');
      setSearchParams(newSearchParams);
    }
    setShowDropdownMenu(false);
  };
  const onSearch = (value: string) => {
    setSearchString(value);
    onClearSearch();
  };

  return (
    <>
      <div className={cx(styles.menuContainer, { [styles.searchbarOpen]: showDropdownMenu })}>
        <div className={styles.searchbarContainer}>
          <Search
            autoComplete="off"
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
            onClear={onClearSearch}
          />
          <SearchDropdown
            showDropdownMenu={showDropdownMenu}
            onClose={handleClose}
            searchValue={searchValue}
            onSearch={onSearch}
          />
        </div>
      </div>
      <Backdrop show={showDropdownMenu} onClick={handleClose} />
    </>
  );
};
