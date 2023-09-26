import { AxiosError, AxiosResponse } from 'axios';

export interface AltinnError {
  message: string;
  name: string;
}

export interface TestResult {
  id: number;
  message: string;
}
