export function TextInput({ label, id, error, ...props }) {
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-2 block text-sm font-semibold text-ink-700">{label}</span>
      <input
        className="focus-ring w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-ink-900 placeholder:text-slate-400"
        id={id}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
