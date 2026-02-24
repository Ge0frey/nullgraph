import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "amber" | "ghost" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-white text-[#050505] font-bold hover:bg-white/90 hover:shadow-[0_0_20px_-8px_#adff00]",
  secondary:
    "glass-card text-text-primary hover:border-border-hover hover:bg-white/5",
  amber:
    "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 hover:bg-neon-cyan/20 hover:border-neon-cyan/50 hover:shadow-[0_0_20px_-8px_#00f2ff]",
  ghost:
    "bg-transparent text-text-secondary border border-transparent hover:text-text-primary hover:bg-white/5",
  danger:
    "bg-neon-magenta/10 text-neon-magenta border border-neon-magenta/30 hover:bg-neon-magenta/20 hover:border-neon-magenta/50 hover:shadow-[0_0_20px_-8px_#ff00e5]",
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
