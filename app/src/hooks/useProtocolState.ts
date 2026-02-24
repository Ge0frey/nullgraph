import { useState, useEffect, useCallback } from "react";
import { useProgram } from "../context/ProgramContext";
import { findProtocolStatePDA } from "../lib/pda";
import type { ProtocolStateAccount } from "../types";

export function useProtocolState() {
  const { program } = useProgram();
  const [data, setData] = useState<ProtocolStateAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!program) return;
    setLoading(true);
    setError(null);
    try {
      const [pda] = findProtocolStatePDA();
      const state = await program.account.protocolState.fetch(pda);
      setData(state as unknown as ProtocolStateAccount);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch protocol state");
    } finally {
      setLoading(false);
    }
  }, [program]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
