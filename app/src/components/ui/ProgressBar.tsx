interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, #00f2ff, #ff00e5)",
          }}
        />
      </div>
      <span className="text-[10px] font-mono font-bold text-text-tertiary tracking-widest">
        {current}/{total}
      </span>
    </div>
  );
}
