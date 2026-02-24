import { useState } from "react";
import { PageContainer } from "../components/layout/PageContainer";
import { BountyCard } from "../components/cards/BountyCard";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Spinner } from "../components/ui/Spinner";
import { CreateBountyForm } from "../components/forms/CreateBountyForm";
import { useBounties } from "../hooks/useBounties";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletButton } from "../components/wallet/WalletButton";
import { Plus } from "lucide-react";

export function Market() {
  const { connected } = useWallet();
  const { data: bounties, loading, refetch } = useBounties();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <PageContainer className="pt-20 pb-12">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display font-extrabold text-2xl mb-1">
            Bounty Marketplace
          </h1>
          <p className="text-sm text-text-secondary">
            Post or fulfill bounties for specific null results.
          </p>
        </div>
        {connected ? (
          <Button variant="primary" onClick={() => setShowCreate(true)}>
            <Plus className="w-3.5 h-3.5" />
            Create Bounty
          </Button>
        ) : (
          <WalletButton />
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner className="w-6 h-6" />
        </div>
      ) : bounties.length === 0 ? (
        <div className="text-center py-12 border border-border rounded-lg bg-surface">
          <p className="text-sm text-text-tertiary font-mono">
            No bounties posted yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {bounties.map((bounty) => (
            <BountyCard key={bounty.publicKey.toBase58()} bounty={bounty} />
          ))}
        </div>
      )}

      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="Create Null Bounty"
      >
        <CreateBountyForm
          onSuccess={() => {
            setShowCreate(false);
            refetch();
          }}
        />
      </Modal>
    </PageContainer>
  );
}
