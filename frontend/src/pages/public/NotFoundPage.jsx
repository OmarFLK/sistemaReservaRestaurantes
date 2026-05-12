import { Link } from "react-router-dom";
import { Button } from "../../components/common/Button";

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <section className="max-w-md rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold text-brand-700">404</p>
        <h1 className="mt-2 text-2xl font-bold text-ink-900">Pagina nao encontrada</h1>
        <p className="mt-3 text-sm text-ink-500">A rota acessada nao existe neste prototipo.</p>
        <Link className="mt-6 inline-flex" to="/">
          <Button>Voltar ao inicio</Button>
        </Link>
      </section>
    </main>
  );
}
