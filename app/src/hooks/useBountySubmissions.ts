import { useState, useEffect, useCallback } from "react";
import { PublicKey } from "@solana/web3.js";
import { useProgram } from "../context/ProgramContext";
import type { BountySubmissionWithKey } from "../types";

export function useBountySubmissions(bountyKey?: PublicKey) {
  const { program } = useProgram();
  const [data, setData] = useState<BountySubmissionWithKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!program) return;
    setLoading(true);
    setError(null);
    try {
      const filters = bountyKey
        ? [
            {
              memcmp: {
                offset: 8 + 32 + 32, // discriminator + researcher + null_result
                bytes: bountyKey.toBase58(),
              },
            },
          ]
        : [];
      const accounts = await program.account.bountySubmission.all(filters);
      const submissions = accounts.map((a) => ({
        ...a.account,
        publicKey: a.publicKey,
      })) as BountySubmissionWithKey[];
      setData(submissions);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch submissions");
    } finally {
      setLoading(false);
    }
  }, [program, bountyKey?.toBase58()]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
