import { useEffect, useState } from "react";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { AdminTable } from "../../components/admin/AdminTable";
import { Button } from "../../components/common/Button";
import { ErrorState } from "../../components/common/ErrorState";
import { LoadingState } from "../../components/common/LoadingState";
import { SelectInput } from "../../components/forms/SelectInput";
import { TextInput } from "../../components/forms/TextInput";
import { PageHeader } from "../../components/layout/PageHeader";
import { adminService } from "../../services/adminService";

export function TablesManagement() {
  const [editingTable, setEditingTable] = useState(null);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [tables, setTables] = useState([]);

  useEffect(() => {
    loadTables();
  }, []);

  async function loadTables() {
    try {
      setTables(await adminService.listTables());
    } catch {
      setError("Nao foi possivel carregar as mesas.");
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
      if (editingTable) {
        await adminService.updateTable(editingTable.id, formValues);
        setSuccessMessage("Mesa atualizada com sucesso.");
      } else {
        await adminService.createTable(formValues);
        setSuccessMessage("Mesa criada com sucesso.");
      }

      setEditingTable(null);
      setIsFormOpen(false);
      await loadTables();
    } catch (tableError) {
      setError(tableError.response?.data?.detail || "Nao foi possivel salvar a mesa.");
    }
  }

  async function handleDelete(tableId) {
    setError("");
    setSuccessMessage("");

    try {
      await adminService.deleteTable(tableId);
      setSuccessMessage("Mesa inativada com sucesso.");
      await loadTables();
    } catch (deleteError) {
      setError(deleteError.response?.data?.detail || "Nao foi possivel inativar a mesa.");
    }
  }

  function openCreateForm() {
    setEditingTable(null);
    setIsFormOpen(true);
  }

  function openEditForm(table) {
    setEditingTable(table);
    setIsFormOpen(true);
  }

  if (isLoading) {
    return <LoadingState label="Carregando mesas..." />;
  }

  return (
    <>
      <PageHeader
        action={<Button onClick={openCreateForm}><Plus size={16} /> Nova mesa</Button>}
        description="CRUD de mesas conectado ao backend FastAPI."
        title="Gerenciar mesas"
      />
      {error && <div className="mb-5"><ErrorState message={error} /></div>}
      {successMessage && (
        <div className="mb-5 rounded-lg bg-brand-50 p-4 text-sm font-semibold text-brand-700">
          {successMessage}
        </div>
      )}
      {isFormOpen && (
        <form className="mb-6 grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-4" onSubmit={handleSubmit}>
          <TextInput
            defaultValue={editingTable?.number}
            id="tableNumber"
            label="Numero"
            min="1"
            name="tableNumber"
            required
            type="number"
          />
          <TextInput
            defaultValue={editingTable?.capacity}
            id="capacity"
            label="Capacidade"
            min="1"
            name="capacity"
            required
            type="number"
          />
          <SelectInput defaultValue={editingTable?.status || "ACTIVE"} id="status" label="Status" name="status">
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="MAINTENANCE">MAINTENANCE</option>
          </SelectInput>
          <div className="flex items-end gap-2">
            <Button className="flex-1" type="submit">
              {editingTable ? "Salvar" : "Criar"}
            </Button>
            <Button onClick={() => setIsFormOpen(false)} type="button" variant="outline">
              Cancelar
            </Button>
          </div>
        </form>
      )}
      <AdminTable
        columns={["Numero", "Capacidade", "Area", "Status", "Acoes"]}
        rows={tables}
        renderRow={(table) => (
          <tr key={table.id}>
            <td className="px-4 py-3 font-semibold text-ink-900">Mesa {table.number}</td>
            <td className="px-4 py-3 text-ink-500">{table.capacity} pessoas</td>
            <td className="px-4 py-3 text-ink-500">{table.area}</td>
            <td className="px-4 py-3">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                table.status === "ACTIVE" ? "bg-brand-50 text-brand-700" : "bg-amber-50 text-amber-700"
              }`}>
                {table.status}
              </span>
            </td>
            <td className="px-4 py-3">
              <div className="flex gap-2">
                <Button onClick={() => openEditForm(table)} size="sm" variant="outline">
                  <Edit2 size={14} /> Editar
                </Button>
                <Button onClick={() => handleDelete(table.id)} size="sm" variant="danger">
                  <Trash2 size={14} /> Inativar
                </Button>
              </div>
            </td>
          </tr>
        )}
      />
    </>
  );
}
