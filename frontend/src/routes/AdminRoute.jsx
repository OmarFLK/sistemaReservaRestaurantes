import { Navigate, Outlet } from "react-router-dom";
import { LoadingState } from "../components/common/LoadingState";
import { useAuth } from "../contexts/AuthContext";

export function AdminRoute() {
  const { isAdmin, isAuthenticated, isSessionLoading } = useAuth();

  if (isSessionLoading) {
    return <LoadingState label="Validando permissao..." />;
  }

  if (!isAuthenticated) {
    return <Navigate replace to="/admin/login" />;
  }

  if (!isAdmin) {
    return <Navigate replace to="/unauthorized" />;
  }

  return <Outlet />;
}
