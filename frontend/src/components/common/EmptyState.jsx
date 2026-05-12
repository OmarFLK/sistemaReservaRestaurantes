import { CalendarX } from "lucide-react";

export function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
      <CalendarX className="mx-auto text-slate-400" size={36} />
      <h3 className="mt-4 text-lg font-semibold text-ink-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
