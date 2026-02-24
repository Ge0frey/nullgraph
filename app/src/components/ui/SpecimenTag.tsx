interface SpecimenTagProps {
  label: string;
  variant?: "amber" | "green" | "blue";
}

const variantStyles = {
  amber: "text-null-amber bg-null-amber/10 border-null-amber/30",
  green: "text-archive-green bg-archive-green/10 border-archive-green/30",
  blue: "text-info-blue bg-info-blue/10 border-info-blue/30",
};

export function SpecimenTag({ label, variant = "amber" }: SpecimenTagProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded border text-[11px] font-mono font-semibold tracking-wide ${variantStyles[variant]}`}
    >
      {label}
    </span>
  );
}
