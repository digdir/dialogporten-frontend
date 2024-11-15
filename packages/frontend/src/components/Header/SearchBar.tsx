import { MagnifyingGlassIcon, MultiplyIcon } from '@navikt/aksel-icons';
import cx from 'classnames';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useWindowSize } from '../../../utils/useWindowSize.tsx';
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
  const { isTabletOrSmaller } = useWindowSize();

  const handleClose = () => {
    setShowDropdownMenu(false);
  };

  const onClearSearch = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (newSearchParams.has('data')) {
      newSearchParams.delete('data');
      setSearchParams(newSearchParams, { replace: true });
    }
    setSearchValue('');
    setSearchString('');
  };

  const onClearAndCloseDropdown = () => {
    onClearSearch();
    setShowDropdownMenu(false);
  };

  const onSearch = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    setSearchString(value);
    setShowDropdownMenu(false);
    newSearchParams.set('search', value);
    setSearchParams(newSearchParams, { replace: true });
  };

  useEffect(() => {
    const searchBarParam = new URLSearchParams(searchParams);
    if (searchBarParam.get('search')) {
      return;
    }
    setSearchValue('');
    searchBarParam.delete('search');
  }, [searchParams]);

  return (
    <div className={styles.searchbarContainer}>
      <div className={cx(styles.inputContainer, { [styles.searchbarOpen]: showDropdownMenu })}>
        <div className={styles.searchIcon}>
          <MagnifyingGlassIcon className={styles.searchIcon} />
        </div>
        <input
          type="text"
          autoComplete="off"
          onClick={() => setShowDropdownMenu(true)}
          onFocus={() => {
            setShowDropdownMenu(true);
            if (isTabletOrSmaller) {
              window.scroll({
                top: 65,
                behavior: 'smooth',
              });
            }
          }}
          aria-label={t('header.searchPlaceholder')}
          placeholder={t('header.searchPlaceholder')}
          className={styles.searchInput}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSearch((e.target as HTMLInputElement).value);
            }
          }}
          value={searchValue}
        />
        {showDropdownMenu && (
          <button
            type="button"
            onClick={searchValue ? onClearSearch : onClearAndCloseDropdown}
            className={styles.clearButton}
            aria-label={t('header.clearSearch')}
          >
            <MultiplyIcon className={cx(styles.clearButtonIcon, { [styles.withBackground]: !!searchValue })} />
          </button>
        )}
      </div>
      <SearchDropdown
        showDropdownMenu={showDropdownMenu}
        onClose={handleClose}
        searchValue={searchValue}
        onSearch={onSearch}
      />
      <Backdrop show={showDropdownMenu} onClick={handleClose} />
    </div>
  );
};
