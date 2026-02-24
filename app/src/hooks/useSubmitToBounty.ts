import { useCallback, useState } from "react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useProgram } from "../context/ProgramContext";
import { findSubmissionPDA } from "../lib/pda";
import { useToast } from "../components/ui/Toast";

export function useSubmitToBounty() {
  const { program } = useProgram();
  const { publicKey } = useWallet();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const submit = useCallback(
    async (bountyKey: PublicKey, nullResultKey: PublicKey): Promise<boolean> => {
      if (!program || !publicKey) {
        toast("error", "Please connect your wallet");
        return false;
      }

      setLoading(true);
      try {
        const [submissionPDA] = findSubmissionPDA(bountyKey, nullResultKey);

        toast("info", "Awaiting wallet approval...");

        const tx = await program.methods
          .submitToBounty()
          .accounts({
            researcher: publicKey,
            nullResult: nullResultKey,
            bounty: bountyKey,
            submission: submissionPDA,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        toast("success", "Submission sent!", tx);
        return true;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Transaction failed";
        toast("error", msg);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [program, publicKey, toast]
  );

  return { submit, loading };
}
