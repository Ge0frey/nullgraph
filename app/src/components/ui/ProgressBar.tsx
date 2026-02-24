interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1 bg-surface-raised rounded-full overflow-hidden">
        <div
          className="h-full bg-null-amber rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[10px] font-mono text-text-tertiary">
        {current}/{total}
      </span>
    </div>
  );
}
