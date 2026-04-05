export function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg shadow-black/20 backdrop-blur-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "" }) {
  return (
    <h3 className={`text-sm font-medium uppercase tracking-wide text-slate-500 ${className}`}>
      {children}
    </h3>
  );
}

export function CardValue({ children, className = "" }) {
  return <p className={`mt-1 text-2xl font-semibold text-slate-100 ${className}`}>{children}</p>;
}
