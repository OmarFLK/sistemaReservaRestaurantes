import { Button } from "../../components/common/Button";
import { TextInput } from "../../components/forms/TextInput";
import { PageHeader } from "../../components/layout/PageHeader";
import { useAuth } from "../../contexts/AuthContext";

export function ProfilePage() {
  const { user } = useAuth();

  return (
    <>
      <PageHeader description="Dados do cliente autenticado." title="Meu perfil" />
      <form className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2">
        <TextInput defaultValue={user?.name} id="name" label="Nome" name="name" />
        <TextInput defaultValue={user?.phone} id="phone" label="Telefone" name="phone" />
        <TextInput defaultValue={user?.email} id="email" label="Email" name="email" type="email" />
        <TextInput defaultValue="********" id="password" label="Senha" name="password" type="password" />
        <div className="md:col-span-2">
          <Button>Salvar perfil</Button>
        </div>
      </form>
    </>
  );
}
