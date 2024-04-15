const LOGIN_REDIRECT_STORAGE_KEY = 'arbeidsflate::auth::login_Redirect';
const LOGIN_REDIRECT_QUERY_KEY = 'loggedIn';

export const sanitizeURL = (url: string) => {
  const urlObj = new URL(url);
  urlObj.searchParams.delete(LOGIN_REDIRECT_QUERY_KEY);
  return urlObj.toString();
};

export const saveURL = (url: string) => {
  localStorage.setItem(LOGIN_REDIRECT_STORAGE_KEY, sanitizeURL(url));
};

export const isRedirectURL = (url: string): boolean => {
  return url.includes(LOGIN_REDIRECT_QUERY_KEY);
};

export const removeStoredURL = () => {
  localStorage.removeItem(LOGIN_REDIRECT_STORAGE_KEY);
};

export const getStoredURL = (): string | null => {
  const url = localStorage.getItem(LOGIN_REDIRECT_STORAGE_KEY);
  if (url) {
    return sanitizeURL(url);
  }
  return null;
};
