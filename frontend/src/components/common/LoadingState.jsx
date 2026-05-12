export function LoadingState({ label = "Carregando..." }) {
  return (
    <div className="flex items-center justify-center gap-3 rounded-lg bg-white p-8 text-ink-500">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
