import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { EmptyState } from "../../components/common/EmptyState";
import { ErrorState } from "../../components/common/ErrorState";
import { LoadingState } from "../../components/common/LoadingState";
import { ReservationForm } from "../../components/forms/ReservationForm";
import { PageHeader } from "../../components/layout/PageHeader";
import { reservationService } from "../../services/reservationService";

export function EditReservationPage() {
  const { id } = useParams();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [reservation, setReservation] = useState(null);

  useEffect(() => {
    async function loadReservation() {
      try {
        setReservation(await reservationService.findById(id));
      } catch {
        setError("Nao foi possivel carregar a reserva para edicao.");
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
    return <EmptyState title="Reserva nao encontrada" description="Nao foi possivel abrir a edicao desta reserva." />;
  }

  async function handleSubmit(values) {
    setError("");

    try {
      const updatedReservation = await reservationService.update(id, {
        ...values,
        tableId: reservation.tableId,
      });
      setReservation(updatedReservation);
      setMessage(`Alteracao salva para ${updatedReservation.date} as ${updatedReservation.time}.`);
    } catch (updateError) {
      setError(updateError.response?.data?.detail || "Nao foi possivel editar a reserva.");
    }
  }

  return (
    <>
      <PageHeader description="Atualize data, horario, quantidade de pessoas ou observacoes." title="Editar reserva" />
      {error && <div className="mb-5"><ErrorState message={error} /></div>}
      {message && (
        <div className="mb-5 flex items-center gap-3 rounded-lg bg-brand-50 p-4 text-sm font-semibold text-brand-700">
          <CheckCircle2 size={20} /> {message}
        </div>
      )}
      <ReservationForm initialValues={reservation} onSubmit={handleSubmit} submitLabel="Salvar alteracoes" />
    </>
  );
}
