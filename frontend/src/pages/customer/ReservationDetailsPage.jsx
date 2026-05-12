import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../../components/common/Button";
import { EmptyState } from "../../components/common/EmptyState";
import { ErrorState } from "../../components/common/ErrorState";
import { LoadingState } from "../../components/common/LoadingState";
import { PageHeader } from "../../components/layout/PageHeader";
import { ReservationStatusBadge } from "../../components/reservation/ReservationStatusBadge";
import { reservationService } from "../../services/reservationService";

export function ReservationDetailsPage() {
  const { id } = useParams();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [reservation, setReservation] = useState(null);

  useEffect(() => {
    async function loadReservation() {
      try {
        setReservation(await reservationService.findById(id));
      } catch {
        setError("Nao foi possivel carregar os detalhes da reserva.");
      } finally {
        setIsLoading(false);
      }
    }

    loadReservation();
  }, [id]);

  if (isLoading) {
    return <LoadingState label="Carregando reserva..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!reservation) {
    return <EmptyState title="Reserva nao encontrada" description="Confira se o link acessado esta correto." />;
  }

  return (
    <>
      <PageHeader
        action={<Link to={`/reservations/${id}/edit`}><Button>Editar reserva</Button></Link>}
        description="Resumo completo da reserva selecionada."
        title={`Reserva ${reservation.id}`}
      />
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-ink-900">Mesa {reservation.tableNumber}</h2>
          <ReservationStatusBadge status={reservation.status} />
        </div>
        <dl className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            ["Cliente", reservation.customerName],
            ["Email", reservation.customerEmail],
            ["Data", reservation.date],
            ["Horario", reservation.time],
            ["Pessoas", reservation.partySize],
            ["Termino", reservation.endTime],
          ].map(([label, value]) => (
            <div className="rounded-lg bg-slate-50 p-4" key={label}>
              <dt className="text-xs font-semibold uppercase text-ink-500">{label}</dt>
              <dd className="mt-1 font-semibold text-ink-900">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
