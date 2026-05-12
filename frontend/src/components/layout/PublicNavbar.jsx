import { CalendarCheck, Menu } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "../common/Button";

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-2 font-bold text-ink-900" to="/">
          <span className="rounded-lg bg-brand-600 p-2 text-white">
            <CalendarCheck size={20} />
          </span>
          Reserva Mesa
        </Link>
        <div className="hidden items-center gap-3 md:flex">
          <NavLink className="text-sm font-medium text-ink-500 hover:text-ink-900" to="/login">
            Entrar
          </NavLink>
          <Link to="/register">
            <Button>Comecar reserva</Button>
          </Link>
        </div>
        <Link className="md:hidden" to="/login" aria-label="Abrir login">
          <Menu size={24} />
        </Link>
      </nav>
    </header>
  );
}
