interface StepReviewProps {
  hypothesis: string;
  methodology: string;
  expectedOutcome: string;
  actualOutcome: string;
  pValue: string;
  sampleSize: string;
  dataHash: string;
}

export function StepReview(props: StepReviewProps) {
  const fields = [
    { label: "Hypothesis", value: props.hypothesis },
    { label: "Methodology", value: props.methodology },
    { label: "Expected Outcome", value: props.expectedOutcome },
    { label: "Actual Outcome", value: props.actualOutcome },
    { label: "p-value", value: props.pValue || "—" },
    { label: "Sample Size", value: props.sampleSize || "—" },
    { label: "Data Hash", value: props.dataHash || "0x0000...0000 (no file)" },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="font-display font-black text-sm mb-1 text-text-primary uppercase tracking-tight">
          Review & Submit
        </h3>
        <p className="text-xs text-text-tertiary mb-4">
          Confirm your null result details. This will create an on-chain NKA
          (Null Knowledge Asset).
        </p>
      </div>
      {fields.map((f) => (
        <div
          key={f.label}
          className="glass-card rounded-xl p-4"
        >
          <p className="text-[10px] font-mono font-bold text-text-tertiary uppercase tracking-widest mb-1">
            {f.label}
          </p>
          <p className="text-sm font-body text-text-primary break-all">
            {f.value || "—"}
          </p>
        </div>
      ))}
    </div>
  );
}
