import { useEffect, useState } from "react";
import { AdminTable } from "../../components/admin/AdminTable";
import { EmptyState } from "../../components/common/EmptyState";
import { ErrorState } from "../../components/common/ErrorState";
import { LoadingState } from "../../components/common/LoadingState";
import { PageHeader } from "../../components/layout/PageHeader";
import { adminService } from "../../services/adminService";

export function CustomersManagement() {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCustomers() {
      try {
        setCustomers(await adminService.listCustomers());
      } catch {
        setError("Nao foi possivel carregar clientes.");
      } finally {
        setIsLoading(false);
      }
    }

    loadCustomers();
  }, []);

  if (isLoading) {
    return <LoadingState label="Carregando clientes..." />;
  }

  return (
    <>
      <PageHeader description="Clientes reais cadastrados e resumo de reservas." title="Gerenciar clientes" />
      {error && <div className="mb-5"><ErrorState message={error} /></div>}
      {customers.length === 0 ? (
        <EmptyState title="Nenhum cliente encontrado" description="Clientes cadastrados aparecerao aqui." />
      ) : (
        <AdminTable
          columns={["Nome", "Email", "Cadastro", "Total", "Ativas", "Canceladas"]}
          rows={customers}
          renderRow={(customer) => (
            <tr key={customer.id}>
              <td className="px-4 py-3 font-semibold text-ink-900">{customer.name}</td>
              <td className="px-4 py-3 text-ink-500">{customer.email}</td>
              <td className="px-4 py-3 text-ink-500">{customer.createdAt?.slice(0, 10)}</td>
              <td className="px-4 py-3 text-ink-500">{customer.totalReservations}</td>
              <td className="px-4 py-3 text-ink-500">{customer.activeReservations}</td>
              <td className="px-4 py-3 text-ink-500">{customer.cancelledReservations}</td>
            </tr>
          )}
        />
      )}
    </>
  );
}
