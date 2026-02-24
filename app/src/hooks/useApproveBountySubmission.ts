import { useCallback, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { useProgram } from "../context/ProgramContext";
import { findProtocolStatePDA, findVaultPDA } from "../lib/pda";
import { DEVNET_USDC_MINT } from "../lib/constants";
import { useToast } from "../components/ui/Toast";
import type { NullBountyWithKey, BountySubmissionWithKey } from "../types";

export function useApproveBountySubmission() {
  const { program } = useProgram();
  const { publicKey } = useWallet();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const approve = useCallback(
    async (
      bounty: NullBountyWithKey,
      submission: BountySubmissionWithKey
    ): Promise<boolean> => {
      if (!program || !publicKey) {
        toast("error", "Please connect your wallet");
        return false;
      }

      setLoading(true);
      try {
        const [protocolStatePDA] = findProtocolStatePDA();
        const [vaultPDA] = findVaultPDA(bounty.publicKey);
        const protocol = await program.account.protocolState.fetch(protocolStatePDA);

        const researcherUsdcAta = await getAssociatedTokenAddress(
          DEVNET_USDC_MINT,
          submission.researcher
        );
        const treasuryUsdcAta = await getAssociatedTokenAddress(
          DEVNET_USDC_MINT,
          protocol.treasury
        );

        toast("info", "Awaiting wallet approval...");

        const tx = await program.methods
          .approveBountySubmission()
          .accounts({
            creator: publicKey,
            bounty: bounty.publicKey,
            submission: submission.publicKey,
            nullResult: submission.nullResult,
            vault: vaultPDA,
            researcherUsdcAta,
            treasuryUsdcAta,
            protocolState: protocolStatePDA,
            usdcMint: DEVNET_USDC_MINT,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .rpc();

        toast("success", "Bounty approved! USDC transferred.", tx);
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

  return { approve, loading };
}
