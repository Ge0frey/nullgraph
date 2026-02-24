import type { PublicKey } from "@solana/web3.js";
import type { BN } from "@coral-xyz/anchor";

export interface ProtocolStateAccount {
  authority: PublicKey;
  nkaCounter: BN;
  bountyCounter: BN;
  feeBasisPoints: number;
  treasury: PublicKey;
  bump: number;
}

export interface NullResultAccount {
  researcher: PublicKey;
  specimenNumber: BN;
  hypothesis: number[];
  methodology: number[];
  expectedOutcome: number[];
  actualOutcome: number[];
  pValue: number;
  sampleSize: number;
  dataHash: number[];
  status: number;
  createdAt: BN;
  bump: number;
}

export interface NullBountyAccount {
  creator: PublicKey;
  bountyNumber: BN;
  description: number[];
  rewardAmount: BN;
  usdcMint: PublicKey;
  vault: PublicKey;
  deadline: BN;
  status: number;
  matchedSubmission: PublicKey;
  createdAt: BN;
  vaultBump: number;
  bump: number;
}

export interface BountySubmissionAccount {
  researcher: PublicKey;
  nullResult: PublicKey;
  bounty: PublicKey;
  status: number;
  createdAt: BN;
  bump: number;
}

// Status enums
export const NKA_STATUS = {
  PENDING: 0,
  VERIFIED: 1,
  DISPUTED: 2,
} as const;

export const BOUNTY_STATUS = {
  OPEN: 0,
  MATCHED: 1,
  FULFILLED: 2,
  CLOSED: 3,
} as const;

export const SUBMISSION_STATUS = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
} as const;

// With public key attached
export interface NullResultWithKey extends NullResultAccount {
  publicKey: PublicKey;
}

export interface NullBountyWithKey extends NullBountyAccount {
  publicKey: PublicKey;
}

export interface BountySubmissionWithKey extends BountySubmissionAccount {
  publicKey: PublicKey;
}
