import { useState, useEffect, useCallback } from "react";
import { useProgram } from "../context/ProgramContext";
import type { NullResultWithKey } from "../types";

export function useNullResults() {
  const { program } = useProgram();
  const [data, setData] = useState<NullResultWithKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!program) return;
    setLoading(true);
    setError(null);
    try {
      const accounts = await program.account.nullResult.all();
      const results = accounts.map((a) => ({
        ...a.account,
        publicKey: a.publicKey,
      })) as NullResultWithKey[];
      // Sort by specimen number descending (newest first)
      results.sort((a, b) => b.specimenNumber.toNumber() - a.specimenNumber.toNumber());
      setData(results);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch null results");
    } finally {
      setLoading(false);
    }
  }, [program]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
