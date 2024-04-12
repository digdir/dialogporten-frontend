import { GetDialogDtoSO } from 'dialogporten-types-generated';

export const getDialogs = (): Promise<GetDialogDtoSO[]> => fetch('/dialogs').then((resp) => resp.json());
