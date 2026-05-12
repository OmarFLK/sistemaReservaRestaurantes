import { useEffect, useState } from "react";
import { EmptyState } from "../../components/common/EmptyState";
import { ErrorState } from "../../components/common/ErrorState";
import { LoadingState } from "../../components/common/LoadingState";
import { PageHeader } from "../../components/layout/PageHeader";
import { ReservationCard } from "../../components/reservation/ReservationCard";
import { reservationService } from "../../services/reservationService";
import { useReservationFilters } from "../../hooks/useReservationFilters";

export function MyReservationsPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [reservations, setReservations] = useState([]);
  const { filteredReservations, statusFilter, setStatusFilter } = useReservationFilters(reservations);

  useEffect(() => {
    loadReservations();
  }, []);

  async function loadReservations() {
    try {
      setReservations(await reservationService.listMine());
    } catch {
      setError("Nao foi possivel carregar suas reservas.");
    } finally {
      setIsLoading(false);
    }
  }

  async function cancelReservation(id) {
    setError("");

    try {
      const cancelledReservation = await reservationService.cancel(id);
      setReservations((current) =>
        current.map((reservation) =>
          reservation.id === id ? cancelledReservation : reservation,
        ),
      );
    } catch (cancelError) {
      setError(cancelError.response?.data?.detail || "Nao foi possivel cancelar a reserva.");
    }
  }

  if (isLoading) {
    return <LoadingState label="Carregando reservas..." />;
  }

  return (
    <>
      <PageHeader description="Veja, edite ou cancele suas reservas." title="Minhas reservas" />
      {error && <div className="mb-5"><ErrorState message={error} /></div>}
      <div className="mb-5 flex flex-wrap gap-2">
        {["ALL", "CONFIRMED", "PENDING", "CANCELLED", "COMPLETED"].map((status) => (
          <button
            className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
              statusFilter === status ? "bg-brand-600 text-white" : "bg-white text-ink-500"
            }`}
            key={status}
            onClick={() => setStatusFilter(status)}
            type="button"
          >
            {status === "ALL" ? "Todas" : status}
          </button>
        ))}
      </div>
      <div className="grid gap-4">
        {filteredReservations.length === 0 ? (
          <EmptyState title="Sem reservas neste filtro" description="As reservas criadas aparecerao aqui." />
        ) : (
          filteredReservations.map((reservation) => (
            <ReservationCard key={reservation.id} onCancel={cancelReservation} reservation={reservation} />
          ))
        )}
      </div>
    </>
  );
}
