import { GetDialogDtoSO } from 'dialogporten-types-generated';

interface User {
  name: string;
  roles: string[];
}

export const getUser = (): Promise<User> => fetch('/user').then((resp) => resp.json());
export const getDialogs = (): Promise<GetDialogDtoSO[]> => fetch('/dialogs').then((resp) => resp.json());
