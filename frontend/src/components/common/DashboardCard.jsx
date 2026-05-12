export function DashboardCard({ icon: Icon, label, value, tone = "brand" }) {
  const toneClass =
    tone === "warning"
      ? "bg-amber-50 text-amber-700"
      : tone === "danger"
        ? "bg-red-50 text-red-700"
        : "bg-brand-50 text-brand-700";

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-ink-500">{label}</p>
          <strong className="mt-2 block text-3xl font-bold text-ink-900">{value}</strong>
        </div>
        {Icon && (
          <span className={`rounded-lg p-3 ${toneClass}`}>
            <Icon size={22} />
          </span>
        )}
      </div>
    </article>
  );
}
