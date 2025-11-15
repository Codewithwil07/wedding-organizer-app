import useSWR from 'swr';
import api from './index'; // (Axios kita)

// Ini "fetcher" default. 'key' adalah URL-nya.
const fetcher = (key: string) => api.get(key).then(res => res.data);

/**
 * Hook SWR "pinter" yang siap pake
 * @param key - URL API (atau null)
 */
export function useApi(key: string | null) {
  const { data, error, isLoading, mutate } = useSWR(key, fetcher);

  return {
    data: data, // (Hasil JSON dari 'res.data')
    isLoading,
    isError: error,
    mutate, // (Fungsi 'refresh' data)
  };
}