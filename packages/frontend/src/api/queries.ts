import { GetDialogDtoSO } from 'dialogporten-types-generated';
import { SavedSearch } from '../pages/SavedSearches';

export const getDialogs = (): Promise<GetDialogDtoSO[]> => fetch('/dialogs').then((resp) => resp.json());

export const getSavedSearches = async (): Promise<SavedSearch[]> => {
  return new Promise((resolve) => {
    const historyJSON = localStorage.getItem('searchHistory');
    const history: SavedSearch[] = historyJSON ? JSON.parse(historyJSON) : [];
    resolve(history);
  });
};
