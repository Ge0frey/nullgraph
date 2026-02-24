import { PublicKey } from "@solana/web3.js";

export const PROGRAM_ID = new PublicKey(
  import.meta.env.VITE_PROGRAM_ID ||
    "2u3DXQq9A6UgMryeVSWCNdYLy3Fjh391R5hcfWYkCgZK"
);

export const DEVNET_USDC_MINT = new PublicKey(
  "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
);

export const RPC_URL =
  import.meta.env.VITE_RPC_URL || "https://api.devnet.solana.com";

export const SEEDS = {
  PROTOCOL_STATE: "protocol_state",
  NULL_RESULT: "null_result",
  NULL_BOUNTY: "null_bounty",
  BOUNTY_VAULT: "bounty_vault",
  BOUNTY_SUBMISSION: "bounty_submission",
} as const;
