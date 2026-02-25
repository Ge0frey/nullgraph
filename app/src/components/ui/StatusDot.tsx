interface StatusDotProps {
  color?: "green" | "cyan" | "magenta";
}

const colorMap = {
  green: "bg-[#5a9e6e]",
  cyan: "bg-neon-cyan",
  magenta: "bg-neon-magenta",
};

export function StatusDot({ color = "green" }: StatusDotProps) {
  return (
    <span className={`inline-block w-2 h-2 rounded-full pulse-dot ${colorMap[color]}`} />
  );
}
