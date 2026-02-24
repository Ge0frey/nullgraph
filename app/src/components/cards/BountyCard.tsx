import { Link } from "react-router-dom";
import { Badge } from "../ui/Badge";
import { SpecimenTag } from "../ui/SpecimenTag";
import type { NullBountyWithKey } from "../../types";
import { decodeString, formatBountyNumber, formatUSDC, formatDate, getBountyStatusLabel } from "../../lib/utils";

interface BountyCardProps {
  bounty: NullBountyWithKey;
}

export function BountyCard({ bounty }: BountyCardProps) {
  const bountyNum = bounty.bountyNumber.toNumber();
  const statusLabel = getBountyStatusLabel(bounty.status);
  const badgeVariant = bounty.status === 0 ? "open" : bounty.status === 1 ? "matched" : bounty.status === 2 ? "fulfilled" : "closed";

  return (
    <Link
      to={`/market/${bounty.publicKey.toBase58()}`}
      className="block glass-card glass-card-hover glow-magenta rounded-2xl p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <SpecimenTag label={formatBountyNumber(bountyNum)} variant="magenta" />
        <Badge variant={badgeVariant}>{statusLabel}</Badge>
      </div>
      <p className="text-sm font-body text-text-primary mb-4 line-clamp-2">
        {decodeString(bounty.description)}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-sm font-mono font-bold text-neon-lime">
          {formatUSDC(bounty.rewardAmount.toNumber())} USDC
        </span>
        <span className="text-[10px] font-mono font-bold text-text-tertiary uppercase tracking-widest">
          {formatDate(bounty.deadline.toNumber())}
        </span>
      </div>
    </Link>
  );
}
