import { ArrowRight, CalendarCheck, ShieldCheck, Table2, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/common/Button";
import { DashboardCard } from "../../components/common/DashboardCard";
import { PublicNavbar } from "../../components/layout/PublicNavbar";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PublicNavbar />
      <main>
        <section className="bg-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
            <div className="flex flex-col justify-center">
              <span className="mb-4 w-fit rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
                Reservas inteligentes para restaurantes
              </span>
              <h1 className="text-4xl font-bold tracking-tight text-ink-900 sm:text-5xl">
                Controle mesas, horarios e reservas em uma experiencia unica.
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-ink-500">
                Clientes reservam em poucos passos. Administradores acompanham disponibilidade,
                mesas, clientes e historico em tempo real.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/register">
                  <Button size="lg">
                    Criar conta <ArrowRight size={18} />
                  </Button>
                </Link>
                <Link to="/admin/login">
                  <Button size="lg" variant="outline">
                    Acesso admin
                  </Button>
                </Link>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-soft">
              <div className="rounded-lg bg-white p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-brand-700">Hoje</p>
                    <h2 className="text-2xl font-bold text-ink-900">Mapa de reservas</h2>
                  </div>
                  <CalendarCheck className="text-brand-600" size={32} />
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {["18:30", "19:00", "20:00", "21:30"].map((time, index) => (
                    <div className="rounded-lg border border-slate-200 p-4" key={time}>
                      <p className="text-sm font-semibold text-ink-500">{time}</p>
                      <p className="mt-2 text-xl font-bold text-ink-900">Mesa {index + 2}</p>
                      <p className="text-sm text-ink-500">{index + 2} a {index + 4} pessoas</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
          <DashboardCard icon={Table2} label="Mesas monitoradas" value="18" />
          <DashboardCard icon={Users} label="Clientes ativos" value="240+" />
          <DashboardCard icon={ShieldCheck} label="Conflitos bloqueados" value="100%" />
        </section>
      </main>
    </div>
  );
}
