import { Armchair, Users } from "lucide-react";

export function TableOptionCard({ table, isSelected, onSelect }) {
  return (
    <button
      className={`focus-ring rounded-lg border p-4 text-left transition ${
        isSelected ? "border-brand-600 bg-brand-50" : "border-slate-200 bg-white hover:border-brand-500"
      }`}
      onClick={() => onSelect(table.id)}
      type="button"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <strong className="block text-ink-900">Mesa {table.number}</strong>
          <span className="mt-1 block text-sm text-ink-500">{table.area}</span>
        </div>
        <Armchair className="text-brand-600" size={22} />
      </div>
      <span className="mt-4 flex items-center gap-2 text-sm font-medium text-ink-700">
        <Users size={16} /> Ate {table.capacity} pessoas
      </span>
    </button>
  );
}
