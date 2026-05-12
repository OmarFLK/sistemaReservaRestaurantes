import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LoadingState } from "../components/common/LoadingState";
import { useAuth } from "../contexts/AuthContext";

export function ProtectedRoute() {
  const { isAuthenticated, isSessionLoading } = useAuth();
  const location = useLocation();

  if (isSessionLoading) {
    return <LoadingState label="Validando sessao..." />;
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  return <Outlet />;
}
