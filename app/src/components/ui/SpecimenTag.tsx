interface SpecimenTagProps {
  label: string;
  variant?: "cyan" | "lime" | "magenta";
}

const variantStyles = {
  cyan: "text-neon-cyan bg-neon-cyan/10 border-neon-cyan/30",
  lime: "text-neon-lime bg-neon-lime/10 border-neon-lime/30",
  magenta: "text-neon-magenta bg-neon-magenta/10 border-neon-magenta/30",
};

export function SpecimenTag({ label, variant = "cyan" }: SpecimenTagProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[11px] font-mono font-bold tracking-widest uppercase ${variantStyles[variant]}`}
    >
      {label}
    </span>
  );
}
