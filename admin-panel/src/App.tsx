import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";

// 1. Import Halaman Login & Pesanan (Dashboard)
import LoginPage from "./pages/auth/LoginPage";
import PesananPage from "./pages/pesanan/PesananPage";

// 2. Import 4 Halaman Paket BARU
import DokumentasiPage from "./pages/paket/DokumentasiPage";
import BusanaPage from "./pages/paket/BusanaPage";
import DekorasiPage from "./pages/paket/DekorasiPage";
import AkadResepsiPage from "./pages/paket/AkadResepsiPage";

function App() {
  return (
    <Routes>
      {/* Rute Publik */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rute Privat (Bungkus pake Layout) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* 3. Rute Halaman Utama */}
          <Route path="/" element={<PesananPage />} />

          {/* 4. Rute Halaman Paket (BARU) */}
          <Route path="/paket/dokumentasi" element={<DokumentasiPage />} />
          <Route path="/paket/busana" element={<BusanaPage />} />
          <Route path="/paket/dekorasi" element={<DekorasiPage />} />
          <Route path="/paket/akadresepsi" element={<AkadResepsiPage />} />
        </Route>
      </Route>

      {/* Rute Kalo Nyasar */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
