import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { PROGRAM_ID, SEEDS } from "./constants";

export function findProtocolStatePDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SEEDS.PROTOCOL_STATE)],
    PROGRAM_ID
  );
}

export function findNullResultPDA(
  researcher: PublicKey,
  specimenNumber: number | BN
): [PublicKey, number] {
  const bn = typeof specimenNumber === "number" ? new BN(specimenNumber) : specimenNumber;
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(SEEDS.NULL_RESULT),
      researcher.toBuffer(),
      bn.toArrayLike(Buffer, "le", 8),
    ],
    PROGRAM_ID
  );
}

export function findBountyPDA(
  creator: PublicKey,
  bountyNumber: number | BN
): [PublicKey, number] {
  const bn = typeof bountyNumber === "number" ? new BN(bountyNumber) : bountyNumber;
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(SEEDS.NULL_BOUNTY),
      creator.toBuffer(),
      bn.toArrayLike(Buffer, "le", 8),
    ],
    PROGRAM_ID
  );
}

export function findVaultPDA(bountyPDA: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SEEDS.BOUNTY_VAULT), bountyPDA.toBuffer()],
    PROGRAM_ID
  );
}

export function findSubmissionPDA(
  bountyPDA: PublicKey,
  nullResultPDA: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(SEEDS.BOUNTY_SUBMISSION),
      bountyPDA.toBuffer(),
      nullResultPDA.toBuffer(),
    ],
    PROGRAM_ID
  );
}
