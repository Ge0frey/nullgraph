import { Textarea } from "../ui/Textarea";
import { Input } from "../ui/Input";

interface StepResultsProps {
  expectedOutcome: string;
  actualOutcome: string;
  pValue: string;
  sampleSize: string;
  onChange: (field: string, value: string) => void;
}

export function StepResults({
  expectedOutcome,
  actualOutcome,
  pValue,
  sampleSize,
  onChange,
}: StepResultsProps) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="font-display font-black text-sm mb-1 text-text-primary uppercase tracking-tight">
          Results
        </h3>
        <p className="text-xs text-text-tertiary mb-3">
          Compare what you expected vs. what actually happened.
        </p>
        <Textarea
          label="Expected Outcome"
          placeholder="e.g., Significant inhibition of enzyme activity (p<0.05)..."
          value={expectedOutcome}
          onChange={(e) => onChange("expectedOutcome", e.target.value)}
          rows={2}
          maxLength={128}
        />
        <p className="text-[10px] font-mono font-bold text-text-tertiary mt-1 text-right tracking-widest">
          {expectedOutcome.length}/128
        </p>
      </div>
      <div>
        <Textarea
          label="Actual Outcome"
          placeholder="e.g., No statistically significant effect observed..."
          value={actualOutcome}
          onChange={(e) => onChange("actualOutcome", e.target.value)}
          rows={2}
          maxLength={128}
        />
        <p className="text-[10px] font-mono font-bold text-text-tertiary mt-1 text-right tracking-widest">
          {actualOutcome.length}/128
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="p-value"
          type="number"
          placeholder="e.g., 0.87"
          value={pValue}
          onChange={(e) => onChange("pValue", e.target.value)}
          step="0.0001"
          min="0"
          max="1"
        />
        <Input
          label="Sample Size (n)"
          type="number"
          placeholder="e.g., 200"
          value={sampleSize}
          onChange={(e) => onChange("sampleSize", e.target.value)}
          min="1"
        />
      </div>
    </div>
  );
}
