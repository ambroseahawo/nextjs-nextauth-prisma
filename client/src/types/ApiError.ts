export interface AxiosBaseQueryError {
  status?: number;
  data?: {
    error?: string;
  };
}
