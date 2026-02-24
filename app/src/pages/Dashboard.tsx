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
    <PageContainer className="pt-24 pb-12">
      <div className="mb-10">
        <h1 className="font-display font-black text-3xl uppercase tracking-tight mb-2 text-text-primary">
          Command Center
        </h1>
        <p className="text-sm text-text-secondary">
          Browse the registry of published null results.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total NKAs" value={totalNKAs} accent="cyan" />
        <StatCard label="Total Bounties" value={totalBounties} accent="magenta" />
        <StatCard label="Open Bounties" value={openBounties} accent="lime" />
        <StatCard label="Researchers" value={new Set(results.map(r => r.researcher.toBase58())).size} accent="cyan" />
      </div>

      <div className="mb-5">
        <h2 className="font-display font-black text-sm text-text-secondary uppercase tracking-widest">
          Null Result Registry
        </h2>
      </div>

      {resultsLoading ? (
        <div className="flex justify-center py-12">
          <Spinner className="w-6 h-6" />
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-12 glass-card rounded-2xl">
          <p className="text-sm text-text-tertiary font-mono">
            No null results published yet. Be the first!
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((result) => (
            <NullResultCard key={result.publicKey.toBase58()} result={result} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
