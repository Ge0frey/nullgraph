import { PageContainer } from "../components/layout/PageContainer";
import { SubmitNullResultForm } from "../components/forms/SubmitNullResultForm";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletButton } from "../components/wallet/WalletButton";

export function Submit() {
  const { connected } = useWallet();

  return (
    <PageContainer className="pt-24 pb-12">
      <div className="mb-10 text-center">
        <h1 className="font-display font-black text-3xl uppercase tracking-tight mb-2 text-text-primary">
          Submit Null Result
        </h1>
        <p className="text-sm text-text-secondary">
          Publish your negative result as an on-chain Null Knowledge Asset (NKA).
        </p>
      </div>

      {!connected ? (
        <div className="flex flex-col items-center gap-5 py-12 glass-card rounded-2xl max-w-lg mx-auto">
          <p className="text-sm text-text-tertiary font-mono">
            Connect your wallet to submit a null result.
          </p>
          <WalletButton />
        </div>
      ) : (
        <SubmitNullResultForm />
      )}
    </PageContainer>
  );
}
