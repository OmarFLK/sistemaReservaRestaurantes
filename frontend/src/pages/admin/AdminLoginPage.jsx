import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/common/Button";
import { ErrorState } from "../../components/common/ErrorState";
import { TextInput } from "../../components/forms/TextInput";
import { useAuth } from "../../contexts/AuthContext";

export function AdminLoginPage() {
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.currentTarget);

    try {
      const user = await login(Object.fromEntries(formData.entries()));

      if (user.role !== "ADMIN") {
        navigate("/unauthorized");
        return;
      }

      navigate("/admin/dashboard");
    } catch (loginError) {
      setError(loginError.message);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink-900 px-4">
      <section className="w-full max-w-md rounded-lg bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold text-brand-700">Painel administrativo</p>
        <h1 className="mt-2 text-2xl font-bold text-ink-900">Entrar como admin</h1>
        <p className="mt-2 text-sm text-ink-500">Entre com suas credenciais administrativas para acessar o painel.</p>
        {error && <div className="mt-4"><ErrorState message={error} /></div>}
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <TextInput id="email" label="Email" name="email" required type="email" />
          <TextInput id="password" label="Senha" name="password" required type="password" />
          <Button type="submit">Acessar painel</Button>
        </form>
      </section>
    </main>
  );
}
