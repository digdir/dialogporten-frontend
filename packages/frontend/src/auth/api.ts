import { ApplicationInsightsBLAE } from "../Analytics";

export const getIsAuthenticated = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/isAuthenticated', {
      credentials: 'include',
      cache: 'no-store',
    });
    return response.ok;
  } catch (error) {
    console.log('error', error);
    ApplicationInsightsBLAE.trackError(error, 'Error happened in getIsAuthenticated');
    return false;
  }
};
