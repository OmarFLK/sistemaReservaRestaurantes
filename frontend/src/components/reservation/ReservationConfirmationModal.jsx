import { CalendarDays, CheckCircle2, Clock, Hash, Users, X } from "lucide-react";
import { Button } from "../common/Button";

export function ReservationConfirmationModal({ reservation, onNewReservation, onViewReservations }) {
  if (!reservation) {
    return null;
  }

  const details = [
    ["ID da reserva", `#${String(reservation.id).padStart(2, "0")}`, Hash],
    ["Mesa", `Mesa ${reservation.tableNumber}`, null],
    ["Data", formatDate(reservation.date), CalendarDays],
    ["Horario", `${reservation.time} as ${reservation.endTime}`, Clock],
    ["Pessoas", reservation.partySize, Users],
  ];

  return (
    <div
      aria-labelledby="reservation-confirmation-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/60 px-4 py-6 sm:items-center"
      role="dialog"
    >
      <section className="w-full max-w-lg rounded-lg bg-white p-6 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
              <CheckCircle2 size={28} />
            </span>
            <div>
              <h2 className="text-2xl font-bold text-ink-900" id="reservation-confirmation-title">
                Reserva confirmada!
              </h2>
              <p className="mt-1 text-sm text-ink-500">Sua mesa foi reservada com sucesso.</p>
            </div>
          </div>
          <button
            aria-label="Fechar confirmacao"
            className="focus-ring rounded-lg p-2 text-ink-500 hover:bg-slate-100"
            onClick={onNewReservation}
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <dl className="mt-6 grid gap-3">
          {details.map(([label, value, Icon]) => (
            <div className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 p-3" key={label}>
              <dt className="flex items-center gap-2 text-sm font-semibold text-ink-500">
                {Icon && <Icon size={16} />}
                {label}
              </dt>
              <dd className="text-right text-sm font-bold text-ink-900">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button className="w-full" onClick={onViewReservations}>
            Ver minhas reservas
          </Button>
          <Button className="w-full" onClick={onNewReservation} variant="outline">
            Fazer nova reserva
          </Button>
        </div>
      </section>
    </div>
  );
}

function formatDate(date) {
  if (!date) {
    return "";
  }

  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}
