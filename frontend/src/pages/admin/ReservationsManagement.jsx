import { useEffect, useState } from "react";
import { AdminTable } from "../../components/admin/AdminTable";
import { Button } from "../../components/common/Button";
import { EmptyState } from "../../components/common/EmptyState";
import { ErrorState } from "../../components/common/ErrorState";
import { LoadingState } from "../../components/common/LoadingState";
import { PageHeader } from "../../components/layout/PageHeader";
import { ReservationStatusBadge } from "../../components/reservation/ReservationStatusBadge";
import { adminService } from "../../services/adminService";

export function ReservationsManagement() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [reservations, setReservations] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadReservations();
  }, []);

  async function loadReservations() {
    try {
      setReservations(await adminService.listReservations());
    } catch {
      setError("Nao foi possivel carregar reservas administrativas.");
    } finally {
      setIsLoading(false);
    }
  }

  async function cancelReservation(id) {
    setError("");
    setSuccessMessage("");

    try {
      const cancelledReservation = await adminService.cancelReservation(id);
      setReservations((current) =>
        current.map((reservation) =>
          reservation.id === id ? cancelledReservation : reservation,
        ),
      );
      setSuccessMessage("Reserva cancelada com sucesso.");
    } catch (cancelError) {
      setError(cancelError.response?.data?.detail || "Nao foi possivel cancelar a reserva.");
    }
  }

  async function updateStatus(id, status) {
    setError("");
    setSuccessMessage("");

    try {
      const updatedReservation = await adminService.updateReservation(id, { status });
      setReservations((current) =>
        current.map((reservation) =>
          reservation.id === id ? updatedReservation : reservation,
        ),
      );
      setSuccessMessage("Status da reserva atualizado.");
    } catch (updateError) {
      setError(updateError.response?.data?.detail || "Nao foi possivel atualizar a reserva.");
    }
  }

  if (isLoading) {
    return <LoadingState label="Carregando reservas..." />;
  }

  return (
    <>
      <PageHeader description="Controle operacional das reservas recebidas." title="Gerenciar reservas" />
      {error && <div className="mb-5"><ErrorState message={error} /></div>}
      {successMessage && (
        <div className="mb-5 rounded-lg bg-brand-50 p-4 text-sm font-semibold text-brand-700">
          {successMessage}
        </div>
      )}
      {reservations.length === 0 ? (
        <EmptyState title="Nenhuma reserva encontrada" description="As reservas criadas aparecerao aqui." />
      ) : (
        <AdminTable
          columns={["Cliente", "Mesa", "Data", "Pessoas", "Status", "Acoes"]}
          rows={reservations}
          renderRow={(reservation) => (
            <tr key={reservation.id}>
              <td className="px-4 py-3 font-semibold text-ink-900">{reservation.customerName}</td>
              <td className="px-4 py-3 text-ink-500">Mesa {reservation.tableNumber}</td>
              <td className="px-4 py-3 text-ink-500">{reservation.date} {reservation.time} as {reservation.endTime}</td>
              <td className="px-4 py-3 text-ink-500">{reservation.partySize}</td>
              <td className="px-4 py-3"><ReservationStatusBadge status={reservation.status} /></td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  <select
                    className="rounded-lg border border-slate-300 px-2 py-1 text-sm"
                    onChange={(event) => updateStatus(reservation.id, event.target.value)}
                    value={reservation.status}
                  >
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="CANCELLED">CANCELLED</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="NO_SHOW">NO_SHOW</option>
                  </select>
                  <Button onClick={() => cancelReservation(reservation.id)} size="sm" variant="danger">
                    Cancelar
                  </Button>
                </div>
              </td>
            </tr>
          )}
        />
      )}
    </>
  );
}
