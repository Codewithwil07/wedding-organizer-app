import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";

// 1. Import Halaman Login & Pesanan (Dashboard)
import LoginPage from "./pages/auth/LoginPage";
import PesananPage from "./pages/pesanan/PesananPage";
import BeritaPage from "./pages/berita/BeritaPage"; // <-- Import
import KritikPage from "./pages/kritik/KritikPage"; // <-- Import
import AdminPage from "./pages/kelola-admin/AdminPage"; // Import

// 2. Import 4 Halaman Paket BARU
import DokumentasiPage from "./pages/paket/DokumentasiPage";
import BusanaPage from "./pages/paket/BusanaPage";
import DekorasiPage from "./pages/paket/DekorasiPage";
import AkadResepsiPage from "./pages/paket/AkadResepsiPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage"; // <-- Import
import ResetPasswordPage from "./pages/auth/ResetPasswordPage"; // <-- Import

function App() {
  return (
    <Routes>
      {/* Rute Publik */}
      <Route path="/login" element={<LoginPage />} />

      {/* === TAMBAHAN BARU === */}
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Rute Privat (Bungkus pake Layout) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* 3. Rute Halaman Utama */}
          <Route path="/" element={<PesananPage />} />
          <Route path="/berita" element={<BeritaPage />} />{" "}
          {/* <-- Tambahin Rute Ini */}
          {/* 4. Rute Halaman Paket (BARU) */}
          <Route path="/paket/dokumentasi" element={<DokumentasiPage />} />
          <Route path="/paket/busana" element={<BusanaPage />} />
          <Route path="/paket/dekorasi" element={<DekorasiPage />} />
          <Route path="/paket/akadresepsi" element={<AkadResepsiPage />} />
          <Route path="/kritik" element={<KritikPage />} /> // ...
          <Route path="/admin-list" element={<AdminPage />} />
          {/* <-- Tambahin Rute Ini */}
        </Route>
      </Route>

      {/* Rute Kalo Nyasar */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
