import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "../../components/common/Button";
import { EmptyState } from "../../components/common/EmptyState";
import { ErrorState } from "../../components/common/ErrorState";
import { LoadingState } from "../../components/common/LoadingState";
import { PageHeader } from "../../components/layout/PageHeader";
import { TableOptionCard } from "../../components/reservation/TableOptionCard";
import { SelectInput } from "../../components/forms/SelectInput";
import { TextInput } from "../../components/forms/TextInput";
import { reservationService } from "../../services/reservationService";

export function NewReservationPage() {
  const [search, setSearch] = useState({ date: "2026-05-20", time: "20:00", partySize: 2 });
  const [availableTables, setAvailableTables] = useState([]);
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTableId, setSelectedTableId] = useState("");
  const [confirmation, setConfirmation] = useState("");

  useEffect(() => {
    loadAvailableTables(search);
  }, []);

  async function loadAvailableTables(searchValues) {
    setError("");
    setIsLoading(true);

    try {
      const tables = await reservationService.listAvailableTables(searchValues);
      setAvailableTables(tables);
      setSelectedTableId("");
    } catch {
      setError("Nao foi possivel buscar disponibilidade. Verifique se o backend esta online.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleSearch(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextSearch = Object.fromEntries(formData.entries());
    setSearch(nextSearch);
    setConfirmation("");
    loadAvailableTables(nextSearch);
  }

  async function handleConfirm() {
    const table = availableTables.find((item) => item.id === selectedTableId);

    if (!table) {
      return;
    }

    setError("");
    setIsCreating(true);

    try {
      await reservationService.create({ ...search, tableId: table.id });
      setConfirmation(`Reserva criada para a mesa ${table.number} em ${search.date} as ${search.time}.`);
      await loadAvailableTables(search);
    } catch (createError) {
      setError(createError.response?.data?.detail || "Nao foi possivel criar a reserva.");
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <>
      <PageHeader
        description="Busque mesas por data, horario e quantidade de pessoas. A disponibilidade e validada no backend."
        title="Nova reserva"
      />
      {error && <div className="mb-5"><ErrorState message={error} /></div>}
      <form className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-4" onSubmit={handleSearch}>
        <TextInput defaultValue={search.date} id="date" label="Data" name="date" required type="date" />
        <SelectInput defaultValue={search.time} id="time" label="Horario" name="time">
          {["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"].map((time) => (
            <option key={time} value={time}>{time}</option>
          ))}
        </SelectInput>
        <TextInput defaultValue={search.partySize} id="partySize" label="Pessoas" min="1" name="partySize" required type="number" />
        <div className="flex items-end">
          <Button className="w-full" type="submit">Buscar mesas</Button>
        </div>
      </form>

      {confirmation && (
        <div className="mt-5 flex items-center gap-3 rounded-lg bg-brand-50 p-4 text-sm font-semibold text-brand-700">
          <CheckCircle2 size={20} /> {confirmation}
        </div>
      )}

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-bold text-ink-900">Mesas disponiveis</h2>
        {isLoading ? (
          <LoadingState label="Buscando mesas disponiveis..." />
        ) : availableTables.length === 0 ? (
          <EmptyState title="Nenhuma mesa encontrada" description="Tente outro horario ou reduza a quantidade de pessoas." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {availableTables.map((table) => (
              <TableOptionCard
                isSelected={selectedTableId === table.id}
                key={table.id}
                onSelect={setSelectedTableId}
                table={table}
              />
            ))}
          </div>
        )}
        <div className="mt-5 flex justify-end">
          <Button disabled={!selectedTableId || isCreating} onClick={handleConfirm}>
            {isCreating ? "Confirmando..." : "Confirmar reserva"}
          </Button>
        </div>
      </section>
    </>
  );
}
