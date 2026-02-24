interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[10px] font-mono font-bold text-text-tertiary uppercase tracking-widest">
          {label}
        </label>
      )}
      <input
        className={`w-full bg-white/5 border border-border rounded-2xl px-4 py-2.5 text-sm font-body text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/20 focus:shadow-[0_0_15px_-5px_#00f2ff] transition-cyber ${
          error ? "border-neon-magenta/50" : ""
        } ${className}`}
        {...props}
      />
      {error && (
        <span className="text-[10px] font-mono font-bold text-neon-magenta">{error}</span>
      )}
    </div>
  );
}
