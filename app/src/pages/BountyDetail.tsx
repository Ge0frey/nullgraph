import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { PageContainer } from "../components/layout/PageContainer";
import { Badge } from "../components/ui/Badge";
import { SpecimenTag } from "../components/ui/SpecimenTag";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Spinner } from "../components/ui/Spinner";
import { useBounties } from "../hooks/useBounties";
import { useBountySubmissions } from "../hooks/useBountySubmissions";
import { useNullResults } from "../hooks/useNullResults";
import { useSubmitToBounty } from "../hooks/useSubmitToBounty";
import { useApproveBountySubmission } from "../hooks/useApproveBountySubmission";
import { useCloseBounty } from "../hooks/useCloseBounty";
import {
  decodeString,
  formatBountyNumber,
  formatUSDC,
  formatDate,
  formatSpecimenNumber,
  getBountyStatusLabel,
  shortenAddress,
} from "../lib/utils";
import { useState } from "react";

export function BountyDetail() {
  const { bountyId } = useParams<{ bountyId: string }>();
  const { publicKey } = useWallet();
  const { data: bounties, loading: bLoading, refetch: refetchBounties } = useBounties();
  const { data: results } = useNullResults();

  const bountyKey = bountyId ? new PublicKey(bountyId) : null;
  const bounty = bounties.find((b) => b.publicKey.toBase58() === bountyId);

  const { data: submissions, refetch: refetchSubs } = useBountySubmissions(bountyKey ?? undefined);
  const { submit: submitToBounty, loading: submitLoading } = useSubmitToBounty();
  const { approve, loading: approveLoading } = useApproveBountySubmission();
  const { close, loading: closeLoading } = useCloseBounty();

  const [showNkaSelect, setShowNkaSelect] = useState(false);

  if (bLoading) {
    return (
      <PageContainer className="pt-24 pb-12 flex justify-center">
        <Spinner className="w-6 h-6" />
      </PageContainer>
    );
  }

  if (!bounty) {
    return (
      <PageContainer className="pt-24 pb-12">
        <p className="text-sm text-text-tertiary font-mono text-center py-12">
          Bounty not found.
        </p>
      </PageContainer>
    );
  }

  const isCreator = publicKey && bounty.creator.equals(publicKey);
  const statusLabel = getBountyStatusLabel(bounty.status);
  const badgeVariant = bounty.status === 0 ? "open" : bounty.status === 1 ? "matched" : bounty.status === 2 ? "fulfilled" : "closed";

  // Researcher's NKAs (for submission)
  const myNkas = publicKey ? results.filter((r) => r.researcher.equals(publicKey)) : [];

  const handleSubmitNka = async (nullResultKey: PublicKey) => {
    const ok = await submitToBounty(bounty.publicKey, nullResultKey);
    if (ok) {
      setShowNkaSelect(false);
      refetchBounties();
      refetchSubs();
    }
  };

  const handleApprove = async () => {
    if (submissions.length === 0) return;
    const sub = submissions.find((s) => s.publicKey.toBase58() === bounty.matchedSubmission.toBase58());
    if (!sub) return;
    const ok = await approve(bounty, sub);
    if (ok) {
      refetchBounties();
      refetchSubs();
    }
  };

  const handleClose = async () => {
    const ok = await close(bounty);
    if (ok) {
      refetchBounties();
    }
  };

  return (
    <PageContainer className="pt-24 pb-12">
      <Link
        to="/market"
        className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-text-tertiary hover:text-text-primary uppercase tracking-widest mb-6 transition-cyber"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
      </Link>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-start justify-between mb-4">
            <SpecimenTag
              label={formatBountyNumber(bounty.bountyNumber.toNumber())}
              variant="magenta"
            />
            <Badge variant={badgeVariant}>{statusLabel}</Badge>
          </div>
          <p className="text-sm font-body text-text-primary mb-4">
            {decodeString(bounty.description)}
          </p>
          <div className="flex items-center gap-5 text-xs font-mono">
            <span className="text-neon-lime font-bold">
              {formatUSDC(bounty.rewardAmount.toNumber())} USDC
            </span>
            <span className="text-text-tertiary font-bold uppercase tracking-widest">
              Deadline: {formatDate(bounty.deadline.toNumber())}
            </span>
          </div>
        </div>

        <div className="p-6 border-b border-border">
          <p className="text-[10px] font-mono font-bold text-text-tertiary uppercase tracking-widest mb-1">
            Creator
          </p>
          <a
            href={`https://explorer.solana.com/address/${bounty.creator.toBase58()}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-mono text-neon-cyan hover:underline"
          >
            {shortenAddress(bounty.creator.toBase58())}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Submissions */}
        <div className="p-6">
          <h3 className="font-display font-black text-sm uppercase tracking-tight mb-4 text-text-primary">
            Submissions
          </h3>
          {submissions.length === 0 ? (
            <p className="text-xs font-mono text-text-tertiary">No submissions yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {submissions.map((sub) => {
                const nka = results.find((r) => r.publicKey.equals(sub.nullResult));
                return (
                  <div
                    key={sub.publicKey.toBase58()}
                    className="glass-card rounded-xl p-4 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-mono font-bold text-neon-cyan">
                        {nka
                          ? formatSpecimenNumber(nka.specimenNumber.toNumber())
                          : shortenAddress(sub.nullResult.toBase58())}
                      </span>
                      <span className="text-xs font-mono text-text-tertiary ml-2">
                        by {shortenAddress(sub.researcher.toBase58())}
                      </span>
                    </div>
                    <Badge variant={sub.status === 0 ? "pending" : sub.status === 1 ? "verified" : "disputed"}>
                      {sub.status === 0 ? "Pending" : sub.status === 1 ? "Approved" : "Rejected"}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-border flex gap-3">
          {bounty.status === 0 && !isCreator && publicKey && (
            <Button variant="amber" onClick={() => setShowNkaSelect(true)}>
              Submit Your NKA
            </Button>
          )}
          {bounty.status === 1 && isCreator && (
            <Button variant="primary" onClick={handleApprove} loading={approveLoading}>
              Approve Submission
            </Button>
          )}
          {(bounty.status === 0 || bounty.status === 1) && isCreator && (
            <Button variant="danger" onClick={handleClose} loading={closeLoading}>
              Close & Refund
            </Button>
          )}
        </div>
      </div>

      {/* NKA selection modal */}
      <Modal
        open={showNkaSelect}
        onClose={() => setShowNkaSelect(false)}
        title="Select Your NKA"
      >
        {myNkas.length === 0 ? (
          <p className="text-xs font-mono text-text-tertiary py-4">
            You have no NKAs. Submit a null result first.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {myNkas.map((nka) => (
              <button
                key={nka.publicKey.toBase58()}
                onClick={() => handleSubmitNka(nka.publicKey)}
                disabled={submitLoading}
                className="flex items-center justify-between p-4 glass-card rounded-xl hover:border-neon-cyan/40 transition-cyber text-left"
              >
                <div>
                  <span className="text-xs font-mono font-bold text-neon-cyan">
                    {formatSpecimenNumber(nka.specimenNumber.toNumber())}
                  </span>
                  <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">
                    {decodeString(nka.hypothesis)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </Modal>
    </PageContainer>
  );
}
