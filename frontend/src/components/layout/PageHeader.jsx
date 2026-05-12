export function PageHeader({ title, description, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-ink-900 md:text-3xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-ink-500">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
