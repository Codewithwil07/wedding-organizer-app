import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Bikin 'skeleton' (file kosong) dulu buat halaman-halaman ini:
import LoginPage from "./pages/auth/LoginPage";
import PaketPage from "./pages/paket/PaketPage";
import PesananPage from "./pages/pesanan/PesananPage";
import DashboardLayout from "./components/DashboardLayout"; // (Kita bikin ini)

function App() {
  return (
    <Routes>
      {/* Rute Publik: Halaman Login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rute Privat (WAJIB LOGIN) */}
      <Route element={<ProtectedRoute />}>
        {/* Pake Layout biar ada Sidebar/Header (NANTI) */}
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<PesananPage />} />{" "}
          {/* Halaman utama = Pesanan */}
          <Route path="/paket" element={<PaketPage />} />
          {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
        </Route>
      </Route>

      {/* Rute Kalo Nyasar */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Bikin file 'skeleton' (kosong) biar ga error
// src/pages/auth/LoginPage.tsx -> export default function LoginPage() { return <div>Login</div>; }
// src/pages/paket/PaketPage.tsx -> export default function PaketPage() { return <div>Paket</div>; }
// src/pages/pesanan/PesananPage.tsx -> export default function PesananPage() { return <div>Pesanan</div>; }
// src/components/DashboardLayout.tsx -> import { Outlet } from 'react-router-dom';
//                                     export default function DashboardLayout() { return <div><Outlet /></div>; }

export default App;
