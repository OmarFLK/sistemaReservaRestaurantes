import { useEffect, useState } from "react";
import { AdminTable } from "../../components/admin/AdminTable";
import { EmptyState } from "../../components/common/EmptyState";
import { ErrorState } from "../../components/common/ErrorState";
import { LoadingState } from "../../components/common/LoadingState";
import { PageHeader } from "../../components/layout/PageHeader";
import { adminService } from "../../services/adminService";

export function AuditLogsPage() {
  const [auditLogs, setAuditLogs] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAuditLogs() {
      try {
        setAuditLogs(await adminService.listAuditLogs());
      } catch {
        setError("Nao foi possivel carregar logs de auditoria.");
      } finally {
        setIsLoading(false);
      }
    }

    loadAuditLogs();
  }, []);

  if (isLoading) {
    return <LoadingState label="Carregando logs..." />;
  }

  return (
    <>
      <PageHeader description="Eventos administrativos e de reserva para rastreabilidade futura." title="Logs de auditoria" />
      {error && <div className="mb-5"><ErrorState message={error} /></div>}
      {auditLogs.length === 0 ? (
        <EmptyState title="Nenhum log encontrado" description="Eventos importantes aparecerao aqui." />
      ) : (
        <AdminTable
          columns={["Acao", "Entidade", "Responsavel", "Data"]}
          rows={auditLogs}
          renderRow={(log) => (
            <tr key={log.id}>
              <td className="px-4 py-3 font-semibold text-ink-900">{log.action}</td>
              <td className="px-4 py-3 text-ink-500">{log.entityType} #{log.entityId}</td>
              <td className="px-4 py-3 text-ink-500">{log.actor}</td>
              <td className="px-4 py-3 text-ink-500">{log.date?.slice(0, 19).replace("T", " ")}</td>
            </tr>
          )}
        />
      )}
    </>
  );
}
