import { useEffect, useState } from "react";
import { AdminTable } from "../../components/admin/AdminTable";
import { Button } from "../../components/common/Button";
import { EmptyState } from "../../components/common/EmptyState";
import { ErrorState } from "../../components/common/ErrorState";
import { LoadingState } from "../../components/common/LoadingState";
import { SelectInput } from "../../components/forms/SelectInput";
import { TextInput } from "../../components/forms/TextInput";
import { PageHeader } from "../../components/layout/PageHeader";
import { adminService } from "../../services/adminService";

export function SchedulesManagement() {
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [schedules, setSchedules] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadSchedules();
  }, []);

  async function loadSchedules() {
    try {
      setSchedules(await adminService.listSchedules());
    } catch {
      setError("Nao foi possivel carregar horarios.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    const formValues = Object.fromEntries(new FormData(event.currentTarget).entries());

    try {
      if (editingSchedule) {
        await adminService.updateSchedule(editingSchedule.id, formValues);
        setSuccessMessage("Horario atualizado com sucesso.");
      } else {
        await adminService.createSchedule(formValues);
        setSuccessMessage("Horario criado com sucesso.");
      }

      setEditingSchedule(null);
      setIsFormOpen(false);
      await loadSchedules();
    } catch (scheduleError) {
      setError(scheduleError.response?.data?.detail || "Nao foi possivel salvar o horario.");
    }
  }

  async function handleDelete(scheduleId) {
    setError("");
    setSuccessMessage("");

    try {
      await adminService.deleteSchedule(scheduleId);
      setSuccessMessage("Horario desativado com sucesso.");
      await loadSchedules();
    } catch (deleteError) {
      setError(deleteError.response?.data?.detail || "Nao foi possivel desativar o horario.");
    }
  }

  function openCreateForm() {
    setEditingSchedule(null);
    setIsFormOpen(true);
  }

  function openEditForm(schedule) {
    setEditingSchedule(schedule);
    setIsFormOpen(true);
  }

  if (isLoading) {
    return <LoadingState label="Carregando horarios..." />;
  }

  return (
    <>
      <PageHeader
        action={<Button onClick={openCreateForm}>Novo horario</Button>}
        description="Horarios reais usados pela disponibilidade do backend."
        title="Gerenciar horarios"
      />
      {error && <div className="mb-5"><ErrorState message={error} /></div>}
      {successMessage && (
        <div className="mb-5 rounded-lg bg-brand-50 p-4 text-sm font-semibold text-brand-700">
          {successMessage}
        </div>
      )}
      {isFormOpen && (
        <form className="mb-6 grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-5" onSubmit={handleSubmit}>
          <SelectInput defaultValue={editingSchedule?.dayOfWeek ?? 0} id="dayOfWeek" label="Dia" name="dayOfWeek">
            {["Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado", "Domingo"].map((day, index) => (
              <option key={day} value={index}>{day}</option>
            ))}
          </SelectInput>
          <TextInput defaultValue={editingSchedule?.opensAt || "18:00"} id="opensAt" label="Abertura" name="opensAt" required type="time" />
          <TextInput defaultValue={editingSchedule?.closesAt || "23:00"} id="closesAt" label="Fechamento" name="closesAt" required type="time" />
          <SelectInput defaultValue={String(editingSchedule?.isOpen ?? true)} id="isOpen" label="Status" name="isOpen">
            <option value="true">Aberto</option>
            <option value="false">Fechado</option>
          </SelectInput>
          <div className="flex items-end gap-2">
            <Button className="flex-1" type="submit">{editingSchedule ? "Salvar" : "Criar"}</Button>
            <Button onClick={() => setIsFormOpen(false)} type="button" variant="outline">Cancelar</Button>
          </div>
        </form>
      )}
      {schedules.length === 0 ? (
        <EmptyState title="Nenhum horario cadastrado" description="Crie horarios de funcionamento para liberar reservas." />
      ) : (
        <AdminTable
          columns={["Dia", "Abertura", "Fechamento", "Status", "Acoes"]}
          rows={schedules}
          renderRow={(schedule) => (
            <tr key={schedule.id}>
              <td className="px-4 py-3 font-semibold text-ink-900">{schedule.dayName}</td>
              <td className="px-4 py-3 text-ink-500">{schedule.opensAt}</td>
              <td className="px-4 py-3 text-ink-500">{schedule.closesAt}</td>
              <td className="px-4 py-3 text-ink-500">{schedule.isOpen ? "Aberto" : "Fechado"}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button onClick={() => openEditForm(schedule)} size="sm" variant="outline">Editar</Button>
                  <Button onClick={() => handleDelete(schedule.id)} size="sm" variant="danger">Desativar</Button>
                </div>
              </td>
            </tr>
          )}
        />
      )}
    </>
  );
}
