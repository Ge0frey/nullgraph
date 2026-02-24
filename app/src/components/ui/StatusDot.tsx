interface StatusDotProps {
  color?: "green" | "cyan" | "magenta";
}

const colorMap = {
  green: "bg-[#22c55e] shadow-[0_0_4px_#22c55e]",
  cyan: "bg-neon-cyan shadow-[0_0_4px_#00f2ff]",
  magenta: "bg-neon-magenta shadow-[0_0_4px_#ff00e5]",
};

export function StatusDot({ color = "green" }: StatusDotProps) {
  return (
    <span className={`inline-block w-2 h-2 rounded-full pulse-dot ${colorMap[color]}`} />
  );
}
