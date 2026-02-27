import { useCallback, useState } from "react";
import { SystemProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { BN } from "@coral-xyz/anchor";
import { useProgram } from "../context/ProgramContext";
import { findProtocolStatePDA, findBountyPDA, findVaultPDA } from "../lib/pda";
import { BIO_MINT } from "../lib/constants";
import { useToast } from "../components/ui/Toast";

interface CreateBountyArgs {
  description: number[];
  rewardAmount: number; // in BIO (6 decimals)
  deadline: number; // Unix timestamp
}

export function useCreateBounty() {
  const { program } = useProgram();
  const { publicKey } = useWallet();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const create = useCallback(
    async (args: CreateBountyArgs): Promise<number | null> => {
      if (!program || !publicKey) {
        toast("error", "Please connect your wallet");
        return null;
      }

      setLoading(true);
      try {
        const [protocolStatePDA] = findProtocolStatePDA();
        const state = await program.account.protocolState.fetch(protocolStatePDA);
        const nextBounty = state.bountyCounter.toNumber() + 1;
        const [bountyPDA] = findBountyPDA(publicKey, nextBounty);
        const [vaultPDA] = findVaultPDA(bountyPDA);
        const creatorUsdcAta = await getAssociatedTokenAddress(
          BIO_MINT,
          publicKey
        );

        toast("info", "Awaiting wallet approval...");

        const tx = await program.methods
          .createBounty(
            args.description,
            new BN(args.rewardAmount),
            new BN(args.deadline)
          )
          .accountsPartial({
            creator: publicKey,
            protocolState: protocolStatePDA,
            bounty: bountyPDA,
            vault: vaultPDA,
            creatorUsdcAta,
            usdcMint: BIO_MINT,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        toast("success", `Bounty NB-${String(nextBounty).padStart(4, "0")} created!`, tx);
        return nextBounty;
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

  return { create, loading };
}
