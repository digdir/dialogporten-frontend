import { UseQueryResult, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { QueryKey } from '../types/QueryKey';
import { AltinnError, TestResult } from '../types/global';

export const useTestQuery = (name?: string): UseQueryResult<TestResult | null, AltinnError> => {
  const requestUrl = '/auth/protected';

  return useQuery<TestResult | null, AltinnError>({
    queryKey: [QueryKey.TestQuery],
    queryFn: async () => {
      const response = await axios.get<TestResult>(requestUrl, { headers: { name } });
      console.log('response', response.data);
      return response.data;
    },
  });
};
