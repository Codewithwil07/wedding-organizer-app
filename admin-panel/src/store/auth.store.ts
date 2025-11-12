import { create } from "zustand";
import { persist } from "zustand/middleware"; // (Biar kesimpen di localStorage)

type UserState = {
  email: string;
  role: string;
  nama_user: string;
};

type AuthState = {
  token: string | null;
  user: UserState | null;
  setToken: (token: string, user: UserState) => void;
  logout: () => void;
};

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      token: null,
      user: null,
      // Action buat nyimpen pas login
      setToken: (token, user) => set({ token, user }),
      // Action buat hapus pas logout
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: "cwo-admin-auth-storage", // Nama key di localStorage
    }
  )
);
