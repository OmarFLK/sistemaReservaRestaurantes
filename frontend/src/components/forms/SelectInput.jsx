export function SelectInput({ children, label, id, ...props }) {
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-2 block text-sm font-semibold text-ink-700">{label}</span>
      <select
        className="focus-ring w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-ink-900"
        id={id}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
