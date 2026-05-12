import {
  CalendarDays,
  Clock,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Table2,
  Users,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "../common/Button";
import { useAuth } from "../../contexts/AuthContext";

const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/reservations", label: "Reservas", icon: CalendarDays },
  { to: "/admin/tables", label: "Mesas", icon: Table2 },
  { to: "/admin/customers", label: "Clientes", icon: Users },
  { to: "/admin/schedules", label: "Horarios", icon: Clock },
  { to: "/admin/logs", label: "Auditoria", icon: ListChecks },
];

export function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  return (
    <aside className="border-b border-slate-200 bg-ink-900 p-4 text-white lg:min-h-screen lg:w-72 lg:border-b-0">
      <div className="flex items-center justify-between gap-4 lg:block">
        <div>
          <p className="text-xs font-semibold uppercase text-brand-100">Admin</p>
          <h2 className="text-xl font-bold">Reserva Mesa</h2>
        </div>
        <Button className="lg:hidden" onClick={handleLogout} size="sm" variant="outline">
          Sair
        </Button>
      </div>
      <nav className="mt-6 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
        {adminLinks.map((item) => (
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold ${
                isActive ? "bg-white text-ink-900" : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`
            }
            key={item.to}
            to={item.to}
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <Button className="mt-8 hidden w-full lg:flex" onClick={handleLogout} variant="outline">
        <LogOut size={16} /> Sair
      </Button>
    </aside>
  );
}
