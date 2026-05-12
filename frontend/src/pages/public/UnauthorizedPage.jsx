import { Link } from "react-router-dom";
import { Button } from "../../components/common/Button";

export function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <section className="max-w-md rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-ink-900">Acesso nao autorizado</h1>
        <p className="mt-3 text-sm text-ink-500">
          Sua conta nao possui permissao para acessar esta area administrativa.
        </p>
        <Link className="mt-6 inline-flex" to="/dashboard">
          <Button>Voltar para dashboard</Button>
        </Link>
      </section>
    </main>
  );
}
