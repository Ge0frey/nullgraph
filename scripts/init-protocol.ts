import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram, Connection, Keypair } from "@solana/web3.js";
import fs from "fs";
import path from "path";

async function main() {
  const idlPath = path.resolve(__dirname, "../target/idl/nullgraph.json");
  const idl = JSON.parse(fs.readFileSync(idlPath, "utf-8"));

  const walletPath = path.resolve(
    process.env.HOME!,
    ".config/solana/nullgraph.json"
  );
  const secretKey = Uint8Array.from(
    JSON.parse(fs.readFileSync(walletPath, "utf-8"))
  );
  const keypair = Keypair.fromSecretKey(secretKey);

  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  const wallet = new anchor.Wallet(keypair);
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  anchor.setProvider(provider);

  const programId = new PublicKey("2u3DXQq9A6UgMryeVSWCNdYLy3Fjh391R5hcfWYkCgZK");
  const program = new Program(idl, provider);

  const [protocolStatePDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("protocol_state")],
    programId
  );

  console.log("Authority:", keypair.publicKey.toBase58());
  console.log("Protocol State PDA:", protocolStatePDA.toBase58());
  console.log("Treasury (same as authority):", keypair.publicKey.toBase58());

  // Check if already initialized
  const info = await connection.getAccountInfo(protocolStatePDA);
  if (info) {
    console.log("ProtocolState already exists! Skipping initialization.");
    return;
  }

  console.log("Initializing protocol with fee_basis_points = 250 (2.5%)...");

  const tx = await (program.methods as any)
    .initializeProtocol(250)
    .accounts({
      authority: keypair.publicKey,
      protocolState: protocolStatePDA,
      treasury: keypair.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  console.log("Transaction signature:", tx);
  console.log("Protocol initialized successfully!");

  const state = await (program.account as any).protocolState.fetch(protocolStatePDA);
  console.log("Verified on-chain state:");
  console.log("  authority:", state.authority.toBase58());
  console.log("  nka_counter:", state.nkaCounter.toString());
  console.log("  bounty_counter:", state.bountyCounter.toString());
  console.log("  fee_basis_points:", state.feeBasisPoints);
  console.log("  treasury:", state.treasury.toBase58());
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
