import { useCallback, useState } from "react";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { useProgram } from "../context/ProgramContext";
import { findVaultPDA } from "../lib/pda";
import { DEVNET_USDC_MINT } from "../lib/constants";
import { useToast } from "../components/ui/Toast";
import type { NullBountyWithKey } from "../types";

export function useCloseBounty() {
  const { program } = useProgram();
  const { publicKey } = useWallet();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const close = useCallback(
    async (bounty: NullBountyWithKey): Promise<boolean> => {
      if (!program || !publicKey) {
        toast("error", "Please connect your wallet");
        return false;
      }

      setLoading(true);
      try {
        const [vaultPDA] = findVaultPDA(bounty.publicKey);
        const creatorUsdcAta = await getAssociatedTokenAddress(
          DEVNET_USDC_MINT,
          publicKey
        );

        toast("info", "Awaiting wallet approval...");

        const tx = await program.methods
          .closeBounty()
          .accounts({
            creator: publicKey,
            bounty: bounty.publicKey,
            vault: vaultPDA,
            creatorUsdcAta,
            usdcMint: DEVNET_USDC_MINT,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .rpc();

        toast("success", "Bounty closed! USDC refunded.", tx);
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

  return { close, loading };
}
