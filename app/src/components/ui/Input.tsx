interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-mono font-medium text-text-secondary uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        className={`w-full bg-surface border border-border rounded-md px-3 py-2 text-sm font-body text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-null-amber/50 focus:ring-1 focus:ring-null-amber/20 transition-colors ${
          error ? "border-warning-red/50" : ""
        } ${className}`}
        {...props}
      />
      {error && (
        <span className="text-[10px] font-mono text-warning-red">{error}</span>
      )}
    </div>
  );
}
