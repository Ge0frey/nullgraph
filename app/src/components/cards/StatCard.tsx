interface StatCardProps {
  label: string;
  value: string | number;
  accent?: "cyan" | "lime" | "magenta";
}

const accentColors = {
  cyan: "border-t-neon-cyan",
  lime: "border-t-neon-lime",
  magenta: "border-t-neon-magenta",
};

const labelColors = {
  cyan: "text-neon-cyan",
  lime: "text-neon-lime",
  magenta: "text-neon-magenta",
};

export function StatCard({ label, value, accent = "cyan" }: StatCardProps) {
  return (
    <div
      className={`glass-card ${accentColors[accent]} border-t-2 rounded-2xl p-5`}
    >
      <p className={`text-[11px] font-mono font-bold uppercase tracking-widest mb-2 ${labelColors[accent]}`}>
        {label}
      </p>
      <p className="text-3xl font-mono font-bold text-text-primary">
        {value}
      </p>
    </div>
  );
}
