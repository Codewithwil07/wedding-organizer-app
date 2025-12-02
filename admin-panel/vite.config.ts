import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 'true' artinya: Izinin SEMUA domain (termasuk Ngrok)
    allowedHosts: true,
    // Kalo 'true' error (di vite versi lama), pake array:
    // allowedHosts: ['photoemissive-zariah-semisecret.ngrok-free.dev'],
  },
});
