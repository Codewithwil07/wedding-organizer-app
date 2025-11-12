import axios from "axios";
import { useAuthStore } from "../store/auth.store";

const api = axios.create({
  // PENTING: Pake IP lo, BUKAN localhost
  baseURL: "http://192.168.137.1:3000/api",
});

// "Interceptor" (Satpam otomatis)
// Dia jalan SEBELUM request dikirim
api.interceptors.request.use(
  (config) => {
    // Ambil token dari state Zustand
    const token = useAuthStore.getState().token;

    // Kalo tokennya ada, tempelin ke header
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
