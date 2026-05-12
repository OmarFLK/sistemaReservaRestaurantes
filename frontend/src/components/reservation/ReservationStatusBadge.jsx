import { reservationStatusLabels } from "../../services/reservationStatus";

const statusClass = {
  CONFIRMED: "bg-brand-50 text-brand-700",
  PENDING: "bg-amber-50 text-amber-700",
  CANCELLED: "bg-red-50 text-red-700",
  COMPLETED: "bg-slate-100 text-ink-700",
};

export function ReservationStatusBadge({ status }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass[status]}`}>
      {reservationStatusLabels[status] || status}
    </span>
  );
}
