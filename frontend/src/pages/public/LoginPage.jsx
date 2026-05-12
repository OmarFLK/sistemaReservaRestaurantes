import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/common/Button";
import { ErrorState } from "../../components/common/ErrorState";
import { PublicNavbar } from "../../components/layout/PublicNavbar";
import { TextInput } from "../../components/forms/TextInput";
import { useAuth } from "../../contexts/AuthContext";

export function LoginPage() {
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);

    try {
      const user = await login(Object.fromEntries(formData.entries()));
      navigate(user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard");
    } catch (loginError) {
      setError(loginError.message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicNavbar />
      <main className="mx-auto flex max-w-xl flex-col px-4 py-12 sm:px-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-ink-900">Entrar como cliente</h1>
          <p className="mt-2 text-sm text-ink-500">Use cliente@restaurante.com / 123456.</p>
          {error && <div className="mt-4"><ErrorState message={error} /></div>}
          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            <TextInput id="email" label="Email" name="email" required type="email" />
            <TextInput id="password" label="Senha" name="password" required type="password" />
            <Button type="submit">Entrar</Button>
          </form>
          <p className="mt-5 text-sm text-ink-500">
            Ainda nao tem conta? <Link className="font-semibold text-brand-700" to="/register">Cadastre-se</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
