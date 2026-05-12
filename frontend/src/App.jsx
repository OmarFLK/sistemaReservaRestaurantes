import { Route, Routes } from "react-router-dom";
import { AdminLayout } from "./components/layout/AdminLayout";
import { CustomerLayout } from "./components/layout/CustomerLayout";
import { AdminRoute } from "./routes/AdminRoute";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AuditLogsPage } from "./pages/admin/AuditLogsPage";
import { CustomersManagement } from "./pages/admin/CustomersManagement";
import { ReservationsManagement } from "./pages/admin/ReservationsManagement";
import { SchedulesManagement } from "./pages/admin/SchedulesManagement";
import { TablesManagement } from "./pages/admin/TablesManagement";
import { CustomerDashboard } from "./pages/customer/CustomerDashboard";
import { EditReservationPage } from "./pages/customer/EditReservationPage";
import { MyReservationsPage } from "./pages/customer/MyReservationsPage";
import { NewReservationPage } from "./pages/customer/NewReservationPage";
import { ProfilePage } from "./pages/customer/ProfilePage";
import { ReservationDetailsPage } from "./pages/customer/ReservationDetailsPage";
import { LandingPage } from "./pages/public/LandingPage";
import { LoginPage } from "./pages/public/LoginPage";
import { NotFoundPage } from "./pages/public/NotFoundPage";
import { RegisterPage } from "./pages/public/RegisterPage";
import { UnauthorizedPage } from "./pages/public/UnauthorizedPage";

export default function App() {
  return (
    <Routes>
      <Route element={<LandingPage />} path="/" />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<RegisterPage />} path="/register" />
      <Route element={<AdminLoginPage />} path="/admin/login" />
      <Route element={<UnauthorizedPage />} path="/unauthorized" />

      <Route element={<ProtectedRoute />}>
        <Route element={<CustomerLayout />}>
          <Route element={<CustomerDashboard />} path="/dashboard" />
          <Route element={<NewReservationPage />} path="/reservations/new" />
          <Route element={<MyReservationsPage />} path="/reservations" />
          <Route element={<ReservationDetailsPage />} path="/reservations/:id" />
          <Route element={<EditReservationPage />} path="/reservations/:id/edit" />
          <Route element={<ProfilePage />} path="/profile" />
        </Route>
      </Route>

      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route element={<AdminDashboard />} path="/admin/dashboard" />
          <Route element={<ReservationsManagement />} path="/admin/reservations" />
          <Route element={<TablesManagement />} path="/admin/tables" />
          <Route element={<CustomersManagement />} path="/admin/customers" />
          <Route element={<SchedulesManagement />} path="/admin/schedules" />
          <Route element={<AuditLogsPage />} path="/admin/logs" />
        </Route>
      </Route>

      <Route element={<NotFoundPage />} path="*" />
    </Routes>
  );
}
