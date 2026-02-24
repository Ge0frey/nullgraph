import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { Badge } from "../components/ui/Badge";
import { SpecimenTag } from "../components/ui/SpecimenTag";
import { Spinner } from "../components/ui/Spinner";
import { useNullResults } from "../hooks/useNullResults";
import {
  decodeString,
  formatSpecimenNumber,
  formatDate,
  formatPValue,
  getNkaStatusLabel,
  shortenAddress,
} from "../lib/utils";

export function NullResultDetail() {
  const { specimenNumber } = useParams<{ specimenNumber: string }>();
  const { data: results, loading } = useNullResults();

  const num = parseInt(specimenNumber || "0", 10);
  const result = results.find((r) => r.specimenNumber.toNumber() === num);

  if (loading) {
    return (
      <PageContainer className="pt-24 pb-12 flex justify-center">
        <Spinner className="w-6 h-6" />
      </PageContainer>
    );
  }

  if (!result) {
    return (
      <PageContainer className="pt-24 pb-12">
        <div className="text-center py-12">
          <p className="text-sm text-text-tertiary font-mono">NKA not found.</p>
          <Link to="/dashboard" className="text-xs text-neon-cyan hover:underline mt-2 inline-block font-mono">
            Back to Dashboard
          </Link>
        </div>
      </PageContainer>
    );
  }

  const statusLabel = getNkaStatusLabel(result.status);
  const badgeVariant = result.status === 0 ? "pending" : result.status === 1 ? "verified" : "disputed";
  const hashHex = Array.from(result.dataHash).map(b => b.toString(16).padStart(2, "0")).join("");
  const isZeroHash = result.dataHash.every(b => b === 0);

  return (
    <PageContainer className="pt-24 pb-12">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-text-tertiary hover:text-text-primary uppercase tracking-widest mb-6 transition-cyber"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
      </Link>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-start justify-between mb-4">
            <SpecimenTag label={formatSpecimenNumber(num)} />
            <Badge variant={badgeVariant}>{statusLabel}</Badge>
          </div>
          <h1 className="font-display font-black text-xl text-text-primary uppercase tracking-tight">
            {decodeString(result.hypothesis)}
          </h1>
        </div>

        <div className="grid gap-0 divide-y divide-border">
          <DetailRow label="Methodology" value={decodeString(result.methodology)} />
          <DetailRow label="Expected Outcome" value={decodeString(result.expectedOutcome)} />
          <DetailRow label="Actual Outcome" value={decodeString(result.actualOutcome)} />
          <div className="grid grid-cols-2 divide-x divide-border">
            <DetailRow label="p-value" value={formatPValue(result.pValue)} mono />
            <DetailRow label="Sample Size" value={String(result.sampleSize)} mono />
          </div>
          <DetailRow
            label="Data Hash"
            value={isZeroHash ? "No data attached" : hashHex}
            mono
          />
          <DetailRow
            label="Researcher"
            value={
              <a
                href={`https://explorer.solana.com/address/${result.researcher.toBase58()}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-neon-cyan hover:underline"
              >
                {shortenAddress(result.researcher.toBase58())}
                <ExternalLink className="w-3 h-3" />
              </a>
            }
          />
          <DetailRow label="Created" value={formatDate(result.createdAt.toNumber())} />
          <DetailRow
            label="On-Chain Address"
            value={
              <a
                href={`https://explorer.solana.com/address/${result.publicKey.toBase58()}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-neon-cyan hover:underline"
              >
                {shortenAddress(result.publicKey.toBase58())}
                <ExternalLink className="w-3 h-3" />
              </a>
            }
          />
        </div>
      </div>
    </PageContainer>
  );
}

function DetailRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="p-5">
      <p className="text-[10px] font-mono font-bold text-text-tertiary uppercase tracking-widest mb-1.5">
        {label}
      </p>
      <div className={`text-sm ${mono ? "font-mono" : "font-body"} text-text-primary break-all`}>
        {value}
      </div>
    </div>
  );
}
