import { useCallback, useState } from "react";
import { SystemProgram } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useProgram } from "../context/ProgramContext";
import { findProtocolStatePDA, findNullResultPDA } from "../lib/pda";
import { useToast } from "../components/ui/Toast";

interface SubmitNullResultArgs {
  hypothesis: number[];
  methodology: number[];
  expectedOutcome: number[];
  actualOutcome: number[];
  pValue: number;
  sampleSize: number;
  dataHash: number[];
}

export function useSubmitNullResult() {
  const { program } = useProgram();
  const { publicKey } = useWallet();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const submit = useCallback(
    async (args: SubmitNullResultArgs): Promise<number | null> => {
      if (!program || !publicKey) {
        toast("error", "Please connect your wallet");
        return null;
      }

      setLoading(true);
      try {
        const [protocolStatePDA] = findProtocolStatePDA();
        const state = await program.account.protocolState.fetch(protocolStatePDA);
        const nextSpecimen = state.nkaCounter.toNumber() + 1;
        const [nullResultPDA] = findNullResultPDA(publicKey, nextSpecimen);

        toast("info", "Awaiting wallet approval...");

        const tx = await program.methods
          .submitNullResult(
            args.hypothesis,
            args.methodology,
            args.expectedOutcome,
            args.actualOutcome,
            args.pValue,
            args.sampleSize,
            args.dataHash
          )
          .accountsPartial({
            researcher: publicKey,
            protocolState: protocolStatePDA,
            nullResult: nullResultPDA,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        toast("success", `NKA-${String(nextSpecimen).padStart(4, "0")} submitted!`, tx);
        return nextSpecimen;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Transaction failed";
        toast("error", msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [program, publicKey, toast]
  );

  return { submit, loading };
}
