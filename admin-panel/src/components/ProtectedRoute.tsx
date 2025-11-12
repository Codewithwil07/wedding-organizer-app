import { useAuthStore } from "../store/auth.store";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  // Cek token dari state Zustand
  const { token } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
