import { create } from 'zustand';

// Tipe data minimal buat paket di keranjang
interface CartPaket {
  id: number;
  nama: string;
  harga: number;
  image_url: string | null; // (Tambahin ini buat preview)
  tipe: 'dokumentasi' | 'busana' | 'dekorasi' | 'akadresepsi'; 
}

type CartState = {
  dokumentasi: CartPaket | null;
  busana: CartPaket | null;
  dekorasi: CartPaket | null;
  akadresepsi: CartPaket | null;
  totalHarga: () => number;
  addPackage: (paket: CartPaket) => void;
  removePackage: (tipe: CartPaket['tipe']) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>((set, get) => ({
  dokumentasi: null,
  busana: null,
  dekorasi: null,
  akadresepsi: null,
  totalHarga: () => {
    let total = 0;
    const { dokumentasi, busana, dekorasi, akadresepsi } = get();
    if (dokumentasi) total += dokumentasi.harga;
    if (busana) total += busana.harga;
    if (dekorasi) total += dekorasi.harga;
    if (akadresepsi) total += akadresepsi.harga;
    return total;
  },
  addPackage: (paket) => set({ [paket.tipe]: paket }),
  removePackage: (tipe) => set({ [tipe]: null }),
  clearCart: () => set({
    dokumentasi: null,
    busana: null,
    dekorasi: null,
    akadresepsi: null,
  }),
}));