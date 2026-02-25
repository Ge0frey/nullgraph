import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "amber" | "ghost" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-white/90 text-[#060810] font-bold hover:bg-white",
  secondary:
    "glass-card text-text-primary hover:border-border-hover hover:bg-white/5",
  amber:
    "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/25 hover:bg-neon-cyan/16 hover:border-neon-cyan/40",
  ghost:
    "bg-transparent text-text-secondary border border-transparent hover:text-text-primary hover:bg-white/4",
  danger:
    "bg-neon-magenta/10 text-neon-magenta border border-neon-magenta/25 hover:bg-neon-magenta/16 hover:border-neon-magenta/40",
};

export function Button({
  variant = "primary",
  loading = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-cyber disabled:opacity-40 disabled:cursor-not-allowed ${variantStyles[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      {children}
    </button>
  );
}
