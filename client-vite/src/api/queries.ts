interface User {
  name: string;
  roles: string[];
}

export const getUser = (): Promise<User> => fetch('/user').then((resp) => resp.json());
