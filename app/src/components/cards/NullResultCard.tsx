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
      className="block bg-surface border border-border border-l-2 border-l-null-amber rounded-lg p-4 hover:border-border-hover hover:bg-surface-raised/50 transition-all hatching"
    >
      <div className="flex items-start justify-between mb-2">
        <SpecimenTag label={formatSpecimenNumber(specimenNum)} />
        <Badge variant={badgeVariant}>{statusLabel}</Badge>
      </div>
      <h3 className="text-sm font-body font-medium text-text-primary mb-1 line-clamp-2">
        {decodeString(result.hypothesis)}
      </h3>
      <p className="text-xs font-mono text-text-tertiary">
        {formatDate(result.createdAt.toNumber())}
      </p>
    </Link>
  );
}
