import useSWR from "swr";
import api from "./index"; // Instance Axios kita
import { StatusPesananEnum } from "../utils/schemas"; // Kita akan tambahin ini

// Tipe data balikan dari API pagination kita
interface PaginatedData<T> {
  data: T[];
  meta: {
    nextCursor: number | null;
    limit: number;
  };
}

// Tipe data Pesanan (yang kita butuh di frontend)
export interface Pesanan {
  id_pesan: number;
  harga: number;
  status: StatusPesananEnum; // PENDING, DITERIMA, DITOLAK, DIBATALKAN
  alamat: string;
  waktu_awal: string; // (Ini string ISO Date)
  user: {
    nama_user: string;
    email: string;
  };
  // Kita bisa 'include' paket-paketnya kalo mau, tapi buat list admin cukup 'user'
}

// Fungsi 'fetcher' yang bakal dipake SWR
const fetcher = (key: string) =>
  api.get<PaginatedData<Pesanan>>(key).then((res) => res.data);

/**
 * Hook SWR reusable buat ngambil data SEMUA pesanan (admin)
 * @param cursor - ID 'nextCursor' dari halaman sebelumnya
 */
export function useAdminPesanan(cursor: number | null = null) {
  // Bikin 'key' (URL) yang dinamis
  const url = `/admin/pesanan?limit=10${cursor ? `&cursor=${cursor}` : ""}`;

  // Panggil SWR
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
  });

  return {
    pesananData: data,
    isLoading,
    isError: error,
    mutate, // (PENTING! Ini buat refresh data setelah update)
  };
}
