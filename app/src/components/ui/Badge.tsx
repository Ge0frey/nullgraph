type BadgeVariant = "pending" | "verified" | "disputed" | "open" | "matched" | "fulfilled" | "closed";

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  pending: "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30",
  verified: "bg-neon-lime/10 text-neon-lime border-neon-lime/30",
  disputed: "bg-neon-magenta/10 text-neon-magenta border-neon-magenta/30",
  open: "bg-neon-lime/10 text-neon-lime border-neon-lime/30",
  matched: "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30",
  fulfilled: "bg-neon-lime/10 text-neon-lime border-neon-lime/30",
  closed: "bg-white/5 text-text-tertiary border-white/10",
};

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest border ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
}
