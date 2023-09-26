import axios from 'axios';
import { UseQueryResult, useQuery } from 'react-query';
import { AltinnError, TestResult } from '../types/global';
import { QueryKey } from '../types/QueryKey';

export const useTestQuery = (name?: string): UseQueryResult<TestResult | null, AltinnError> => {
  const requestUrl = '/api/v1/test';
  return useQuery<TestResult | null, AltinnError>([QueryKey.TestQuery], () =>
    axios.get(requestUrl, { headers: { name } }).then((response) => {
      return response.data;
    })
  );
};
