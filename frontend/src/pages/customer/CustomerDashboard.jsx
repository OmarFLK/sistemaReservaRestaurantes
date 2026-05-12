import { useEffect, useState } from "react";
import { CalendarCheck, CalendarClock, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/common/Button";
import { DashboardCard } from "../../components/common/DashboardCard";
import { ErrorState } from "../../components/common/ErrorState";
import { LoadingState } from "../../components/common/LoadingState";
import { PageHeader } from "../../components/layout/PageHeader";
import { ReservationCard } from "../../components/reservation/ReservationCard";
import { reservationService } from "../../services/reservationService";
import { adminService } from "../../services/adminService";

export function CustomerDashboard() {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [myReservations, restaurantTables] = await Promise.all([
          reservationService.listMine(),
          adminService.listTables(),
        ]);
        setReservations(myReservations);
        setTables(restaurantTables);
      } catch {
        setError("Nao foi possivel carregar seu dashboard. Verifique se o backend esta online.");
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const nextReservations = reservations.filter((reservation) => reservation.status !== "COMPLETED").slice(0, 2);

  if (isLoading) {
    return <LoadingState label="Carregando dashboard..." />;
  }

  return (
    <>
      <PageHeader
        action={<Link to="/reservations/new"><Button>Nova reserva</Button></Link>}
        description="Acompanhe suas proximas reservas e mantenha seus dados atualizados."
        title="Dashboard do cliente"
      />
      {error && <div className="mb-5"><ErrorState message={error} /></div>}
      <div className="grid gap-4 md:grid-cols-3">
        <DashboardCard icon={CalendarCheck} label="Reservas ativas" value={nextReservations.length} />
        <DashboardCard icon={CalendarClock} label="Historico" value={reservations.length} />
        <DashboardCard icon={Utensils} label="Mesas cadastradas" value={tables.length} />
      </div>
      <section className="mt-8 grid gap-4">
        <h2 className="text-xl font-bold text-ink-900">Proximas reservas</h2>
        {nextReservations.map((reservation) => (
          <ReservationCard key={reservation.id} onCancel={() => {}} reservation={reservation} />
        ))}
      </section>
    </>
  );
}
