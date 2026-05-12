import { useEffect, useState } from "react";
import { CalendarCheck, Clock, Table2, Users } from "lucide-react";
import { DashboardCard } from "../../components/common/DashboardCard";
import { EmptyState } from "../../components/common/EmptyState";
import { ErrorState } from "../../components/common/ErrorState";
import { LoadingState } from "../../components/common/LoadingState";
import { PageHeader } from "../../components/layout/PageHeader";
import { AdminTable } from "../../components/admin/AdminTable";
import { ReservationStatusBadge } from "../../components/reservation/ReservationStatusBadge";
import { adminService } from "../../services/adminService";

export function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setDashboard(await adminService.fetchDashboard());
      } catch {
        setError("Nao foi possivel carregar o dashboard administrativo.");
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (isLoading) {
    return <LoadingState label="Carregando painel admin..." />;
  }

  return (
    <>
      <PageHeader description="Visao operacional do restaurante para reservas, mesas e clientes." title="Dashboard admin" />
      {error && <div className="mb-5"><ErrorState message={error} /></div>}
      <div className="grid gap-4 md:grid-cols-4">
        <DashboardCard icon={CalendarCheck} label="Reservas" value={dashboard?.totalReservations || 0} />
        <DashboardCard icon={Table2} label="Mesas" value={dashboard?.totalTables || 0} />
        <DashboardCard icon={Users} label="Clientes" value={dashboard?.totalCustomers || 0} />
        <DashboardCard icon={Clock} label="Ativas" tone="warning" value={dashboard?.activeReservations || 0} />
      </div>
      {dashboard && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-5 text-sm text-ink-700 shadow-sm">
          Ocupacao atual: <strong>{dashboard.occupancySummary.occupancy_rate}%</strong> com{" "}
          <strong>{dashboard.occupancySummary.occupied_tables}</strong> mesas ocupadas de{" "}
          <strong>{dashboard.occupancySummary.active_tables}</strong> mesas ativas.
        </div>
      )}
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-bold text-ink-900">Reservas recentes</h2>
        {!dashboard?.nextReservations?.length ? (
          <EmptyState title="Sem reservas recentes" description="As proximas reservas aparecerao aqui." />
        ) : (
          <AdminTable
            columns={["Cliente", "Mesa", "Data", "Horario", "Status"]}
            rows={dashboard.nextReservations}
            renderRow={(reservation) => (
              <tr key={reservation.id}>
                <td className="px-4 py-3 font-semibold text-ink-900">{reservation.customerName}</td>
                <td className="px-4 py-3 text-ink-500">Mesa {reservation.tableNumber}</td>
                <td className="px-4 py-3 text-ink-500">{reservation.date}</td>
                <td className="px-4 py-3 text-ink-500">{reservation.time}</td>
                <td className="px-4 py-3"><ReservationStatusBadge status={reservation.status} /></td>
              </tr>
            )}
          />
        )}
      </section>
    </>
  );
}
