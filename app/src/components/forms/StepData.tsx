import { Upload } from "lucide-react";

interface StepDataProps {
  dataFile: File | null;
  dataHash: string;
  onFileChange: (file: File | null) => void;
}

export function StepData({ dataFile, dataHash, onFileChange }: StepDataProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="font-display font-bold text-sm mb-1 text-text-primary">
          Data Attachment
        </h3>
        <p className="text-xs text-text-tertiary mb-3">
          Optionally upload your data file. A SHA-256 hash will be computed
          and stored on-chain as a tamper-proof fingerprint. The file itself
          stays off-chain.
        </p>
      </div>

      <label className="flex flex-col items-center justify-center gap-2 p-8 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-null-amber/40 transition-colors">
        <Upload className="w-6 h-6 text-text-tertiary" />
        <span className="text-xs font-mono text-text-secondary">
          {dataFile ? dataFile.name : "Click to upload (CSV, PDF, JSON, etc.)"}
        </span>
        <input
          type="file"
          className="hidden"
          onChange={(e) => onFileChange(e.target.files?.[0] || null)}
        />
      </label>

      {dataHash && (
        <div className="bg-surface-raised border border-border rounded-md p-3">
          <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-wider mb-1">
            SHA-256 Hash
          </p>
          <p className="text-xs font-mono text-null-amber break-all">
            {dataHash}
          </p>
        </div>
      )}

      {!dataFile && (
        <p className="text-xs font-mono text-text-tertiary">
          No file selected — a zero hash will be used.
        </p>
      )}
    </div>
  );
}
