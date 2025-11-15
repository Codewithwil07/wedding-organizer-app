import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

type UserState = { email: string; role: string; nama_user: string; };
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
      setToken: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'cwo-app-auth-storage', 
      storage: createJSONStorage(() => AsyncStorage), 
    }
  )
);