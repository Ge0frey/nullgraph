interface StatusDotProps {
  color?: "green" | "amber" | "red";
}

const colorMap = {
  green: "bg-archive-green",
  amber: "bg-null-amber",
  red: "bg-warning-red",
};

export function StatusDot({ color = "green" }: StatusDotProps) {
  return (
    <span className={`inline-block w-2 h-2 rounded-full pulse-dot ${colorMap[color]}`} />
  );
}
