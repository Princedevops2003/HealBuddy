export function Spinner({ className = "", label = "Loading" }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`} role="status" aria-live="polite">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-teal-400"
        aria-hidden
      />
      <span className="text-sm text-slate-500">{label}</span>
    </div>
  );
}
