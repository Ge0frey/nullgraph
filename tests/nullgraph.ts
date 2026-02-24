import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Nullgraph } from "../target/types/nullgraph";
import {
  createMint,
  createAssociatedTokenAccount,
  mintTo,
  getAccount,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { assert, expect } from "chai";

describe("nullgraph", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.nullgraph as Program<Nullgraph>;
  const authority = provider.wallet as anchor.Wallet;

  let protocolStatePDA: PublicKey;
  let protocolStateBump: number;
  let usdcMint: PublicKey;
  let treasuryKeypair = Keypair.generate();

  // Helper to encode a string into a fixed-size byte array
  function encodeString(s: string, len: number): number[] {
    const buf = Buffer.alloc(len);
    buf.write(s, "utf-8");
    return Array.from(buf);
  }

  before(async () => {
    // Derive protocol state PDA
    [protocolStatePDA, protocolStateBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("protocol_state")],
      program.programId
    );

    // Create a mock USDC mint
    usdcMint = await createMint(
      provider.connection,
      (authority as any).payer,
      authority.publicKey,
      null,
      6 // 6 decimals like USDC
    );
  });

  // -----------------------------------------------------------------------
  // Phase 1: Protocol + NullResult
  // -----------------------------------------------------------------------

  it("initialize_protocol creates ProtocolState with correct values", async () => {
    const tx = await program.methods
      .initializeProtocol(250) // 2.5% fee
      .accounts({
        authority: authority.publicKey,
        protocolState: protocolStatePDA,
        treasury: treasuryKeypair.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const state = await program.account.protocolState.fetch(protocolStatePDA);
    assert.ok(state.authority.equals(authority.publicKey));
    assert.equal(state.nkaCounter.toNumber(), 0);
    assert.equal(state.bountyCounter.toNumber(), 0);
    assert.equal(state.feeBasisPoints, 250);
    assert.ok(state.treasury.equals(treasuryKeypair.publicKey));
  });

  it("initialize_protocol fails on second call (PDA exists)", async () => {
    try {
      await program.methods
        .initializeProtocol(500)
        .accounts({
          authority: authority.publicKey,
          protocolState: protocolStatePDA,
          treasury: treasuryKeypair.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      assert.fail("Should have thrown");
    } catch (err: any) {
      // PDA already initialized - this is expected
      expect(err.toString()).to.include("already in use");
    }
  });

  let firstNullResultPDA: PublicKey;

  it("submit_null_result creates NKA with correct fields", async () => {
    const hypothesis = encodeString("Compound X inhibits enzyme Y", 128);
    const methodology = encodeString("Double-blind RCT, n=200", 128);
    const expectedOutcome = encodeString("Significant inhibition (p<0.05)", 128);
    const actualOutcome = encodeString("No significant effect observed", 128);
    const pValue = 8700; // 0.8700
    const sampleSize = 200;
    const dataHash = Array.from(Buffer.alloc(32, 0xab));

    // Derive PDA for specimen_number = 1 (counter is 0, will become 1)
    [firstNullResultPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("null_result"),
        authority.publicKey.toBuffer(),
        new anchor.BN(1).toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    await program.methods
      .submitNullResult(
        hypothesis,
        methodology,
        expectedOutcome,
        actualOutcome,
        pValue,
        sampleSize,
        dataHash
      )
      .accounts({
        researcher: authority.publicKey,
        protocolState: protocolStatePDA,
        nullResult: firstNullResultPDA,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const nr = await program.account.nullResult.fetch(firstNullResultPDA);
    assert.ok(nr.researcher.equals(authority.publicKey));
    assert.equal(nr.specimenNumber.toNumber(), 1);
    assert.equal(nr.pValue, 8700);
    assert.equal(nr.sampleSize, 200);
    assert.equal(nr.status, 0); // Pending

    // Check counter incremented
    const state = await program.account.protocolState.fetch(protocolStatePDA);
    assert.equal(state.nkaCounter.toNumber(), 1);
  });

  let secondNullResultPDA: PublicKey;
  let researcher2: Keypair;

  it("multiple researchers can submit independently", async () => {
    researcher2 = Keypair.generate();

    // Airdrop SOL to researcher2
    const sig = await provider.connection.requestAirdrop(
      researcher2.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(sig);

    // Submit second NKA from authority (specimen #2)
    const [secondPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("null_result"),
        authority.publicKey.toBuffer(),
        new anchor.BN(2).toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );
    secondNullResultPDA = secondPDA;

    await program.methods
      .submitNullResult(
        encodeString("Gene A causes trait B", 128),
        encodeString("CRISPR knockout mice", 128),
        encodeString("Trait B absent in KO mice", 128),
        encodeString("No phenotype change", 128),
        6500,
        50,
        Array.from(Buffer.alloc(32, 0xcd))
      )
      .accounts({
        researcher: authority.publicKey,
        protocolState: protocolStatePDA,
        nullResult: secondNullResultPDA,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const state = await program.account.protocolState.fetch(protocolStatePDA);
    assert.equal(state.nkaCounter.toNumber(), 2);
  });

  // -----------------------------------------------------------------------
  // Phase 4: Bounty Marketplace
  // -----------------------------------------------------------------------

  let bountyPDA: PublicKey;
  let vaultPDA: PublicKey;
  let creatorUsdcAta: PublicKey;
  let treasuryUsdcAta: PublicKey;
  const rewardAmount = 1_000_000; // 1 USDC (6 decimals)

  it("create_bounty creates bounty + vault, escrows USDC", async () => {
    // Create creator's USDC ATA and mint tokens
    creatorUsdcAta = await createAssociatedTokenAccount(
      provider.connection,
      (authority as any).payer,
      usdcMint,
      authority.publicKey
    );

    await mintTo(
      provider.connection,
      (authority as any).payer,
      usdcMint,
      creatorUsdcAta,
      authority.publicKey,
      10_000_000 // 10 USDC
    );

    // Create treasury ATA
    treasuryUsdcAta = await createAssociatedTokenAccount(
      provider.connection,
      (authority as any).payer,
      usdcMint,
      treasuryKeypair.publicKey
    );

    // Derive bounty PDA (bounty_counter=0, will be 1)
    [bountyPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("null_bounty"),
        authority.publicKey.toBuffer(),
        new anchor.BN(1).toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    [vaultPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("bounty_vault"), bountyPDA.toBuffer()],
      program.programId
    );

    const deadline = Math.floor(Date.now() / 1000) + 86400; // 24h from now

    await program.methods
      .createBounty(
        encodeString(
          "Looking for null result on CRISPR efficiency in plant cells",
          256
        ),
        new anchor.BN(rewardAmount),
        new anchor.BN(deadline)
      )
      .accounts({
        creator: authority.publicKey,
        protocolState: protocolStatePDA,
        bounty: bountyPDA,
        vault: vaultPDA,
        creatorUsdcAta: creatorUsdcAta,
        usdcMint: usdcMint,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    // Verify bounty
    const bounty = await program.account.nullBounty.fetch(bountyPDA);
    assert.ok(bounty.creator.equals(authority.publicKey));
    assert.equal(bounty.bountyNumber.toNumber(), 1);
    assert.equal(bounty.rewardAmount.toNumber(), rewardAmount);
    assert.equal(bounty.status, 0); // Open

    // Verify vault holds USDC
    const vaultAccount = await getAccount(provider.connection, vaultPDA);
    assert.equal(Number(vaultAccount.amount), rewardAmount);

    // Verify counter incremented
    const state = await program.account.protocolState.fetch(protocolStatePDA);
    assert.equal(state.bountyCounter.toNumber(), 1);
  });

  let submissionPDA: PublicKey;

  it("submit_to_bounty creates submission and sets bounty to Matched", async () => {
    [submissionPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("bounty_submission"),
        bountyPDA.toBuffer(),
        firstNullResultPDA.toBuffer(),
      ],
      program.programId
    );

    await program.methods
      .submitToBounty()
      .accounts({
        researcher: authority.publicKey,
        nullResult: firstNullResultPDA,
        bounty: bountyPDA,
        submission: submissionPDA,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const submission = await program.account.bountySubmission.fetch(
      submissionPDA
    );
    assert.ok(submission.researcher.equals(authority.publicKey));
    assert.ok(submission.nullResult.equals(firstNullResultPDA));
    assert.equal(submission.status, 0); // Pending

    const bounty = await program.account.nullBounty.fetch(bountyPDA);
    assert.equal(bounty.status, 1); // Matched
    assert.ok(bounty.matchedSubmission.equals(submissionPDA));
  });

  it("submit_to_bounty fails if bounty not Open", async () => {
    // Bounty is now Matched, submitting again should fail
    const [anotherSubmission] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("bounty_submission"),
        bountyPDA.toBuffer(),
        secondNullResultPDA.toBuffer(),
      ],
      program.programId
    );

    try {
      await program.methods
        .submitToBounty()
        .accounts({
          researcher: authority.publicKey,
          nullResult: secondNullResultPDA,
          bounty: bountyPDA,
          submission: anotherSubmission,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      assert.fail("Should have thrown");
    } catch (err: any) {
      expect(err.toString()).to.include("InvalidBountyStatus");
    }
  });

  it("approve_bounty_submission transfers correct payout + fee", async () => {
    // Create researcher USDC ATA (same as creator here since authority is both)
    const researcherUsdcAta = creatorUsdcAta; // authority is both creator and researcher in this test

    // Get balances before
    const creatorBefore = await getAccount(
      provider.connection,
      creatorUsdcAta
    );

    await program.methods
      .approveBountySubmission()
      .accounts({
        creator: authority.publicKey,
        bounty: bountyPDA,
        submission: submissionPDA,
        nullResult: firstNullResultPDA,
        vault: vaultPDA,
        researcherUsdcAta: researcherUsdcAta,
        treasuryUsdcAta: treasuryUsdcAta,
        protocolState: protocolStatePDA,
        usdcMint: usdcMint,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    // Verify statuses
    const bounty = await program.account.nullBounty.fetch(bountyPDA);
    assert.equal(bounty.status, 2); // Fulfilled

    const submission = await program.account.bountySubmission.fetch(
      submissionPDA
    );
    assert.equal(submission.status, 1); // Approved

    // Verify USDC transfers: 2.5% fee = 25000, payout = 975000
    const fee = Math.floor((rewardAmount * 250) / 10000); // 25000
    const payout = rewardAmount - fee; // 975000

    const treasuryAccount = await getAccount(
      provider.connection,
      treasuryUsdcAta
    );
    assert.equal(Number(treasuryAccount.amount), fee);

    // Vault should be empty
    const vaultAccount = await getAccount(provider.connection, vaultPDA);
    assert.equal(Number(vaultAccount.amount), 0);
  });

  // Test close_bounty with a new bounty
  let bounty2PDA: PublicKey;
  let vault2PDA: PublicKey;

  it("close_bounty refunds full amount to creator", async () => {
    // Create another bounty
    [bounty2PDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("null_bounty"),
        authority.publicKey.toBuffer(),
        new anchor.BN(2).toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    [vault2PDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("bounty_vault"), bounty2PDA.toBuffer()],
      program.programId
    );

    const deadline = Math.floor(Date.now() / 1000) + 86400;

    await program.methods
      .createBounty(
        encodeString("Need null result on drug X side effects", 256),
        new anchor.BN(500_000), // 0.5 USDC
        new anchor.BN(deadline)
      )
      .accounts({
        creator: authority.publicKey,
        protocolState: protocolStatePDA,
        bounty: bounty2PDA,
        vault: vault2PDA,
        creatorUsdcAta: creatorUsdcAta,
        usdcMint: usdcMint,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    // Get creator balance before close
    const creatorBefore = await getAccount(
      provider.connection,
      creatorUsdcAta
    );

    await program.methods
      .closeBounty()
      .accounts({
        creator: authority.publicKey,
        bounty: bounty2PDA,
        vault: vault2PDA,
        creatorUsdcAta: creatorUsdcAta,
        usdcMint: usdcMint,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    // Verify bounty closed
    const bounty = await program.account.nullBounty.fetch(bounty2PDA);
    assert.equal(bounty.status, 3); // Closed

    // Verify refund
    const creatorAfter = await getAccount(
      provider.connection,
      creatorUsdcAta
    );
    assert.equal(
      Number(creatorAfter.amount) - Number(creatorBefore.amount),
      500_000
    );
  });

  it("close_bounty fails if already Fulfilled", async () => {
    try {
      await program.methods
        .closeBounty()
        .accounts({
          creator: authority.publicKey,
          bounty: bountyPDA, // First bounty is Fulfilled
          vault: vaultPDA,
          creatorUsdcAta: creatorUsdcAta,
          usdcMint: usdcMint,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();
      assert.fail("Should have thrown");
    } catch (err: any) {
      expect(err.toString()).to.include("InvalidBountyStatus");
    }
  });
});
