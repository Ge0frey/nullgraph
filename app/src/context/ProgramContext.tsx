import { createContext, useContext, useMemo } from "react";
import { AnchorProvider } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getProgram, type NullGraphProgram } from "../lib/program";
import type { AnchorWallet } from "@solana/wallet-adapter-react";

interface ProgramContextState {
  program: NullGraphProgram | null;
  provider: AnchorProvider | null;
}

const ProgramContext = createContext<ProgramContextState>({
  program: null,
  provider: null,
});

export function ProgramProvider({ children }: { children: React.ReactNode }) {
  const { connection } = useConnection();
  const wallet = useWallet();

  const provider = useMemo(() => {
    if (!wallet.publicKey || !wallet.signTransaction || !wallet.signAllTransactions) return null;
    return new AnchorProvider(
      connection,
      wallet as AnchorWallet,
      { commitment: "confirmed" }
    );
  }, [connection, wallet]);

  const program = useMemo(() => {
    if (!provider) return null;
    return getProgram(provider);
  }, [provider]);

  return (
    <ProgramContext.Provider value={{ program, provider }}>
      {children}
    </ProgramContext.Provider>
  );
}

export function useProgram() {
  const ctx = useContext(ProgramContext);
  return ctx;
}
