import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/common/Button";
import { ErrorState } from "../../components/common/ErrorState";
import { PublicNavbar } from "../../components/layout/PublicNavbar";
import { TextInput } from "../../components/forms/TextInput";
import { useAuth } from "../../contexts/AuthContext";

export function RegisterPage() {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const user = await register(Object.fromEntries(formData.entries()));
      setSuccessMessage("Cadastro criado com sucesso.");
      window.setTimeout(
        () => navigate(user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard"),
        500,
      );
    } catch (registerError) {
      setError(registerError.response?.data?.detail || "Nao foi possivel criar o cadastro.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicNavbar />
      <main className="mx-auto flex max-w-2xl flex-col px-4 py-12 sm:px-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-ink-900">Criar cadastro</h1>
          <p className="mt-2 text-sm text-ink-500">Crie sua conta para reservar mesas pelo sistema real.</p>
          {error && <div className="mt-4"><ErrorState message={error} /></div>}
          {successMessage && (
            <div className="mt-4 rounded-lg bg-brand-50 p-3 text-sm font-medium text-brand-700">
              {successMessage}
            </div>
          )}
          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <TextInput id="name" label="Nome completo" name="name" required />
              <TextInput id="phone" label="Telefone" name="phone" required />
            </div>
            <TextInput id="email" label="Email" name="email" required type="email" />
            <TextInput id="password" label="Senha" name="password" required type="password" />
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? "Criando..." : "Criar conta"}
            </Button>
          </form>
          <p className="mt-5 text-sm text-ink-500">
            Ja possui conta? <Link className="font-semibold text-brand-700" to="/login">Entrar</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
