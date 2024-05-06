import { GetDialogDtoSO } from 'dialogporten-types-generated';
import { SavedSearchDTO } from '../pages/SavedSearches';
import axios from 'axios';

export const getDialogs = (): Promise<GetDialogDtoSO[]> => fetch('/dialogs').then((resp) => resp.json());

export const getSavedSearches = (): Promise<SavedSearchDTO[]> =>
  axios.get<SavedSearchDTO[]>('/api/saved-search').then((response) => response.data);
