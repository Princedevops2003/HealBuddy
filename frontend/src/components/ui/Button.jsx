export function Button({ children, className = "", variant = "primary", ...props }) {
  const variants = {
    primary:
      "bg-teal-600 text-white hover:bg-teal-500 focus-visible:ring-teal-400 disabled:opacity-50",
    secondary:
      "border border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700 focus-visible:ring-slate-500",
    ghost: "text-teal-400 hover:bg-teal-500/10 focus-visible:ring-teal-500",
  };

  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
