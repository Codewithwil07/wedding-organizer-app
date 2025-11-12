import useSWR from "swr";
import api from "./index"; // Instance Axios kita

// Tipe data balikan dari API pagination kita
interface PaginatedData<T> {
  data: T[];
  meta: {
    nextCursor: number | null;
    limit: number;
  };
}

// Tipe untuk paket (generik)
interface Paket {
  id_dokum?: number;
  id_busana?: number;
  id_dekorasi?: number;
  id_ar?: number;
  nama: string;
  harga: number;
  image_url: string | null;
}

// Fungsi 'fetcher' yang bakal dipake SWR
// 'key' adalah URL-nya
const fetcher = (key: string) =>
  api.get<PaginatedData<Paket>>(key).then((res) => res.data);

/**
 * Hook SWR reusable buat ngambil data paket (admin)
 * @param paketType - 'dokumentasi', 'busana', 'dekorasi', 'akadresepsi'
 * @param cursor - ID 'nextCursor' dari halaman sebelumnya
 */
export function useAdminPaket(paketType: string, cursor: number | null = null) {
  // 1. Bikin 'key' (URL) yang dinamis
  // Kalo cursor berubah, SWR otomatis re-fetch
  const url = `/admin/paket/${paketType}?limit=10${
    cursor ? `&cursor=${cursor}` : ""
  }`;

  // 2. Panggil SWR
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    revalidateOnFocus: false, // (Opsional: biar ga re-fetch pas ganti tab)
  });

  return {
    paketData: data,
    isLoading,
    isError: error,
    mutate, // (Ini fungsi 'trigger' refresh data, PENTING!)
  };
}
