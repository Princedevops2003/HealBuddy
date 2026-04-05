export function Label({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-slate-400">
      {children}
    </label>
  );
}

export function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-slate-100 placeholder:text-slate-600 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 ${className}`}
      {...props}
    />
  );
}
