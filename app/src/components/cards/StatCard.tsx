interface StatCardProps {
  label: string;
  value: string | number;
  accent?: "amber" | "green" | "blue";
}

const accentColors = {
  amber: "border-t-null-amber",
  green: "border-t-archive-green",
  blue: "border-t-info-blue",
};

export function StatCard({ label, value, accent = "amber" }: StatCardProps) {
  return (
    <div
      className={`bg-surface border border-border ${accentColors[accent]} border-t-2 rounded-lg p-4`}
    >
      <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-2xl font-mono font-semibold text-text-primary">
        {value}
      </p>
    </div>
  );
}
