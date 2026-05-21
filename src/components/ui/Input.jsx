export function Input({ label, error, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full rounded-lg border bg-(--surface) dark:bg-slate-950 px-4 py-2 text-slate-900 dark:text-white placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-300 focus:ring-red-500/50 dark:border-red-700'
            : 'border-slate-200 focus:ring-blue-500/50 dark:border-white/10'
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
