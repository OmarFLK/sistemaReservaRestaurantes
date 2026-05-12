import { CalendarPlus, ClipboardList, LogOut, User } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Button } from "../common/Button";
import { useAuth } from "../../contexts/AuthContext";

const customerLinks = [
  { to: "/dashboard", label: "Dashboard", icon: ClipboardList },
  { to: "/reservations/new", label: "Nova reserva", icon: CalendarPlus },
  { to: "/reservations", label: "Minhas reservas", icon: ClipboardList },
  { to: "/profile", label: "Perfil", icon: User },
];

export function CustomerLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-medium text-brand-700">Area do cliente</p>
            <h1 className="text-xl font-bold text-ink-900">Ola, {user?.name}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {customerLinks.map((item) => (
              <NavLink
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-semibold ${
                    isActive ? "bg-brand-50 text-brand-700" : "text-ink-500 hover:bg-slate-100"
                  }`
                }
                key={item.to}
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
            <Button onClick={handleLogout} variant="outline">
              <LogOut size={16} /> Sair
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
