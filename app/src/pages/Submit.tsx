import { PageContainer } from "../components/layout/PageContainer";
import { SubmitNullResultForm } from "../components/forms/SubmitNullResultForm";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletButton } from "../components/wallet/WalletButton";

export function Submit() {
  const { connected } = useWallet();

  return (
    <PageContainer className="pt-20 pb-12">
      <div className="mb-8 text-center">
        <h1 className="font-display font-extrabold text-2xl mb-1">
          Submit Null Result
        </h1>
        <p className="text-sm text-text-secondary">
          Publish your negative result as an on-chain Null Knowledge Asset (NKA).
        </p>
      </div>

      {!connected ? (
        <div className="flex flex-col items-center gap-4 py-12 border border-border rounded-lg bg-surface max-w-lg mx-auto">
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
