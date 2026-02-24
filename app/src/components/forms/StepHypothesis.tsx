import { Textarea } from "../ui/Textarea";

interface StepHypothesisProps {
  hypothesis: string;
  methodology: string;
  onChange: (field: string, value: string) => void;
}

export function StepHypothesis({ hypothesis, methodology, onChange }: StepHypothesisProps) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="font-display font-black text-sm mb-1 text-text-primary uppercase tracking-tight">
          Hypothesis
        </h3>
        <p className="text-xs text-text-tertiary mb-3">
          What hypothesis did you test? What did you expect to find?
        </p>
        <Textarea
          label="Hypothesis Tested"
          placeholder="e.g., Compound X inhibits enzyme Y activity in vitro..."
          value={hypothesis}
          onChange={(e) => onChange("hypothesis", e.target.value)}
          rows={3}
          maxLength={128}
        />
        <p className="text-[10px] font-mono font-bold text-text-tertiary mt-1 text-right tracking-widest">
          {hypothesis.length}/128
        </p>
      </div>
      <div>
        <Textarea
          label="Methodology"
          placeholder="e.g., Double-blind randomized controlled trial, n=200..."
          value={methodology}
          onChange={(e) => onChange("methodology", e.target.value)}
          rows={3}
          maxLength={128}
        />
        <p className="text-[10px] font-mono font-bold text-text-tertiary mt-1 text-right tracking-widest">
          {methodology.length}/128
        </p>
      </div>
    </div>
  );
}
