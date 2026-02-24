import { PageContainer } from "../components/layout/PageContainer";
import { StatCard } from "../components/cards/StatCard";
import { NullResultCard } from "../components/cards/NullResultCard";
import { Spinner } from "../components/ui/Spinner";
import { useNullResults } from "../hooks/useNullResults";
import { useProtocolState } from "../hooks/useProtocolState";
import { useBounties } from "../hooks/useBounties";

export function Dashboard() {
  const { data: results, loading: resultsLoading } = useNullResults();
  const { data: protocol } = useProtocolState();
  const { data: bounties } = useBounties();

  const totalNKAs = protocol?.nkaCounter.toNumber() ?? 0;
  const totalBounties = protocol?.bountyCounter.toNumber() ?? 0;
  const openBounties = bounties.filter((b) => b.status === 0).length;

  return (
    <PageContainer className="pt-20 pb-12">
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-2xl mb-1">Dashboard</h1>
        <p className="text-sm text-text-secondary">
          Browse the registry of published null results.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard label="Total NKAs" value={totalNKAs} accent="amber" />
        <StatCard label="Total Bounties" value={totalBounties} accent="blue" />
        <StatCard label="Open Bounties" value={openBounties} accent="green" />
        <StatCard label="Researchers" value={new Set(results.map(r => r.researcher.toBase58())).size} accent="amber" />
      </div>

      <div className="mb-4">
        <h2 className="font-display font-bold text-sm text-text-secondary uppercase tracking-wider">
          Null Result Registry
        </h2>
      </div>

      {resultsLoading ? (
        <div className="flex justify-center py-12">
          <Spinner className="w-6 h-6" />
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-12 border border-border rounded-lg bg-surface">
          <p className="text-sm text-text-tertiary font-mono">
            No null results published yet. Be the first!
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((result) => (
            <NullResultCard key={result.publicKey.toBase58()} result={result} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
