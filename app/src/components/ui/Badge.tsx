type BadgeVariant = "pending" | "verified" | "disputed" | "open" | "matched" | "fulfilled" | "closed";

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  pending: "bg-null-amber/10 text-null-amber border-null-amber/30",
  verified: "bg-archive-green/10 text-archive-green border-archive-green/30",
  disputed: "bg-warning-red/10 text-warning-red border-warning-red/30",
  open: "bg-archive-green/10 text-archive-green border-archive-green/30",
  matched: "bg-info-blue/10 text-info-blue border-info-blue/30",
  fulfilled: "bg-archive-green/10 text-archive-green border-archive-green/30",
  closed: "bg-text-tertiary/10 text-text-tertiary border-text-tertiary/30",
};

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider border ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
}
