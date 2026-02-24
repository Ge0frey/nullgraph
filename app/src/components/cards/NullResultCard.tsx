import { Link } from "react-router-dom";
import { Badge } from "../ui/Badge";
import { SpecimenTag } from "../ui/SpecimenTag";
import type { NullResultWithKey } from "../../types";
import { decodeString, formatSpecimenNumber, formatDate, getNkaStatusLabel } from "../../lib/utils";

interface NullResultCardProps {
  result: NullResultWithKey;
}

export function NullResultCard({ result }: NullResultCardProps) {
  const specimenNum = result.specimenNumber.toNumber();
  const statusLabel = getNkaStatusLabel(result.status);
  const badgeVariant = result.status === 0 ? "pending" : result.status === 1 ? "verified" : "disputed";

  return (
    <Link
      to={`/nka/${specimenNum}`}
      className="block glass-card glass-card-hover glow-cyan rounded-2xl p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <SpecimenTag label={formatSpecimenNumber(specimenNum)} />
        <Badge variant={badgeVariant}>{statusLabel}</Badge>
      </div>
      <h3 className="text-sm font-body font-medium text-text-primary mb-2 line-clamp-2">
        {decodeString(result.hypothesis)}
      </h3>
      <p className="text-[10px] font-mono font-bold text-text-tertiary uppercase tracking-widest">
        {formatDate(result.createdAt.toNumber())}
      </p>
    </Link>
  );
}
