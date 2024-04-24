import styles from './savedSearches.module.css';
import { compressQueryParams } from '../Inbox/Inbox';
import { SavedSearch } from '.';
import { ChevronRightIcon, EllipsisHorizontalIcon, TrashIcon } from '@heroicons/react/24/outline';

interface SavedSearchesItemProps {
  savedSearch?: SavedSearch;
  onDelete?: (id: number) => void;
}

const RenderButtons = ({ savedSearch, onDelete }: SavedSearchesItemProps) => {
  if (!savedSearch) return null;
  return (
    <div>
      <button className={styles.linkButton} type="submit" onClick={() => onDelete?.(savedSearch.id)}>
        <TrashIcon style={{ width: 16, height: 16 }} />
      </button>
      <button className={styles.linkButton} type="button" onClick={() => console.log(savedSearch)}>
        <EllipsisHorizontalIcon className={styles.icon} />
      </button>
      <a href={`inbox?data=${compressQueryParams(savedSearch)}`}>
        <ChevronRightIcon className={styles.icon} />
      </a>
    </div>
  );
};

export const SavedSearchesItem = ({ savedSearch, onDelete }: SavedSearchesItemProps) => {
  if (!savedSearch) return null;

  if (savedSearch.name)
    return (
      <>
        <div className={styles.savedSearchItem} key={savedSearch.id}>
          <div className={styles.searchDetails}>{savedSearch.name}</div>
          <RenderButtons savedSearch={savedSearch} onDelete={onDelete} />
        </div>
        <hr />
      </>
    );

  return (
    <>
      <div className={styles.savedSearchItem} key={savedSearch.id}>
        <div className={styles.searchDetails}>
          <span className={styles.searchString}>{savedSearch.searchString && `«${savedSearch.searchString}»`}</span>
          {savedSearch.searchString && `${savedSearch.filters?.length ? ' + ' : ''}`}
          {savedSearch.filters?.map(({ fieldName }, index) => {
            return (
              <span key={`${fieldName}${index}`} className={styles.filterElement}>{`${
                index === 0 ? '' : ' +'
              } ${fieldName}`}</span>
            );
          })}
        </div>
        <RenderButtons savedSearch={savedSearch} onDelete={onDelete} />
      </div>
      <hr />
    </>
  );
};
