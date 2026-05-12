const variants = {
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  secondary: "bg-ink-900 text-white hover:bg-ink-700",
  outline: "border border-slate-300 bg-white text-ink-700 hover:bg-slate-50",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "text-ink-700 hover:bg-slate-100",
};

const sizes = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-base",
};

export function Button({
  children,
  className = "",
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}) {
  return (
    <button
      className={`focus-ring inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition ${variants[variant]} ${sizes[size]} ${className}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
