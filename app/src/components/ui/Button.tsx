import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "amber" | "ghost" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-archive-green/10 text-archive-green border border-archive-green/30 hover:bg-archive-green/20 hover:border-archive-green/50",
  secondary:
    "bg-surface-raised text-text-primary border border-border hover:bg-surface hover:border-border-hover",
  amber:
    "bg-null-amber/10 text-null-amber border border-null-amber/30 hover:bg-null-amber/20 hover:border-null-amber/50",
  ghost:
    "bg-transparent text-text-secondary border border-transparent hover:text-text-primary hover:bg-surface",
  danger:
    "bg-warning-red/10 text-warning-red border border-warning-red/30 hover:bg-warning-red/20 hover:border-warning-red/50",
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
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-xs font-mono font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${variantStyles[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      {children}
    </button>
  );
}
