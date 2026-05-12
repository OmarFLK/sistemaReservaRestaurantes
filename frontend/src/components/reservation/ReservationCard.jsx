import { CalendarDays, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../common/Button";
import { ReservationStatusBadge } from "./ReservationStatusBadge";

export function ReservationCard({ reservation, onCancel }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-ink-900">Mesa {reservation.tableNumber}</h3>
            <ReservationStatusBadge status={reservation.status} />
          </div>
          <div className="mt-4 grid gap-2 text-sm text-ink-500 sm:grid-cols-3">
            <span className="flex items-center gap-2">
              <CalendarDays size={16} /> {reservation.date}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={16} /> {reservation.time}
            </span>
            <span className="flex items-center gap-2">
              <Users size={16} /> {reservation.partySize} pessoas
            </span>
          </div>
          {reservation.notes && <p className="mt-3 text-sm text-ink-500">{reservation.notes}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={`/reservations/${reservation.id}`}>
            <Button variant="outline">Detalhes</Button>
          </Link>
          <Link to={`/reservations/${reservation.id}/edit`}>
            <Button variant="secondary">Editar</Button>
          </Link>
          {reservation.status !== "CANCELLED" && (
            <Button onClick={() => onCancel(reservation.id)} variant="danger">
              Cancelar
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
