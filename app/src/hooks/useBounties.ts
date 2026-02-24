import { useState, useEffect, useCallback } from "react";
import { useProgram } from "../context/ProgramContext";
import type { NullBountyWithKey } from "../types";

export function useBounties() {
  const { program } = useProgram();
  const [data, setData] = useState<NullBountyWithKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!program) return;
    setLoading(true);
    setError(null);
    try {
      const accounts = await program.account.nullBounty.all();
      const bounties = accounts.map((a) => ({
        ...a.account,
        publicKey: a.publicKey,
      })) as NullBountyWithKey[];
      // Sort by bounty number descending (newest first)
      bounties.sort((a, b) => b.bountyNumber.toNumber() - a.bountyNumber.toNumber());
      setData(bounties);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch bounties");
    } finally {
      setLoading(false);
    }
  }, [program]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
