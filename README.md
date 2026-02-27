# NullGraph

**Tokenizing the 95% of science that journals throw away.**

NullGraph is a Solana-native protocol that turns unpublished negative scientific results into permanent on-chain **Null Knowledge Assets (NKAs)** and provides a bounty marketplace where BioDAOs and researchers pay for the null results they need -- denominated in **BIO tokens**.

---

## Why NullGraph

95% of null results in scientific research are never published. This causes:

- **Publication bias** -- journals favor positive results, distorting the scientific record.
- **Wasted replication** -- researchers unknowingly repeat experiments already proven to fail.
- **Lost investment** -- billions in research funding produces results that sit in filing cabinets.
- **Zero incentive** -- researchers have no career, financial, or reputational reason to publish non-discoveries.

NullGraph solves all four by making null results permanent, discoverable, and economically valuable.

---

## How It Works

### 1. Null Knowledge Assets (NKAs)

A researcher submits a structured null result (hypothesis, methodology, expected vs. actual outcome, p-value, sample size, optional data hash) through a guided four-step form. On submission, the program creates an on-chain PDA storing all metadata. The researcher receives a specimen identifier (e.g., `NKA-0042`) and the result becomes browsable on the Dashboard.

The optional data hash stores a SHA-256 fingerprint of any attached data file. The file stays off-chain; the hash provides a tamper-proof link between the on-chain record and the underlying dataset.

### 2. Bounty Marketplace

A BioDAO or researcher posts a bounty describing a specific null result they need, a BIO token reward, and a deadline. On creation, the BIO reward is escrowed into a PDA-controlled vault -- it leaves the creator's wallet immediately. A researcher with a matching NKA can submit it to the bounty. The creator reviews the submission and approves it (triggering automatic BIO payout minus a protocol fee) or closes the bounty to reclaim their escrowed funds.

### 3. Protocol Fee Layer

A configurable fee (default 2.5%) is deducted from every bounty settlement and routed to a treasury wallet.

---

## Architecture

```
                +----------------------------+
                |   Researcher's Browser     |
                |   (React 19 + Vite 7.3)   |
                +-----+--------------+-------+
                      |              |
           Write (tx) |              | Read (RPC)
                      v              v
       +--------------+--------------+-----------+
       |        Solana Devnet Cluster             |
       |                                          |
       |  +------------------------------------+  |
       |  |  NullGraph Anchor Program          |  |
       |  |  (2u3DXQq...CgZK)                 |  |
       |  |                                    |  |
       |  |  Accounts:                         |  |
       |  |   - ProtocolState (singleton)      |  |
       |  |   - NullResult PDAs                |  |
       |  |   - NullBounty PDAs                |  |
       |  |   - BountySubmission PDAs          |  |
       |  |   - Vault Token Accounts           |  |
       |  +------------------------------------+  |
       |                                          |
       |  +------------------------------------+  |
       |  |  SPL Token Interface               |  |
       |  |  (BIO transfers via CPI)           |  |
       |  +------------------------------------+  |
       +------------------------------------------+
```

- **Writes** go through the Solana Wallet Adapter. The user signs transactions in Phantom, which are submitted to the Anchor program.
- **Reads** use `getProgramAccounts` RPC calls through the Anchor client. There is no backend server, database, or indexer.
- **BIO transfers** use CPI `transfer_checked` to the SPL Token Interface, which validates the mint and decimal precision.

---

## On-Chain Program

The Anchor program lives in a single file (`programs/nullgraph/src/lib.rs`, ~593 lines). It uses Anchor 0.31.1 with `anchor-spl` for SPL Token Interface CPI and associated token accounts.

### Accounts

#### ProtocolState (Singleton)

Global configuration. Stores auto-incrementing counters, fee rate, and treasury address.

| Field | Type | Description |
|---|---|---|
| `authority` | `Pubkey` | Protocol admin wallet |
| `nka_counter` | `u64` | Auto-incrementing NKA counter |
| `bounty_counter` | `u64` | Auto-incrementing bounty counter |
| `fee_basis_points` | `u16` | Fee on settlement (250 = 2.5%) |
| `treasury` | `Pubkey` | Treasury wallet for collected fees |
| `bump` | `u8` | PDA bump seed |

Seeds: `["protocol_state"]`

#### NullResult (One per NKA)

| Field | Type | Description |
|---|---|---|
| `researcher` | `Pubkey` | Submitting wallet |
| `specimen_number` | `u64` | Sequential ID (NKA-0001, NKA-0002, ...) |
| `hypothesis` | `[u8; 128]` | Hypothesis tested (UTF-8, zero-padded) |
| `methodology` | `[u8; 128]` | Methodology summary |
| `expected_outcome` | `[u8; 128]` | What was expected |
| `actual_outcome` | `[u8; 128]` | What actually happened |
| `p_value` | `u32` | Fixed-point (8700 = 0.8700) |
| `sample_size` | `u32` | Sample size n |
| `data_hash` | `[u8; 32]` | SHA-256 of attached data file |
| `status` | `u8` | 0 = Pending, 1 = Verified, 2 = Disputed |
| `created_at` | `i64` | Unix timestamp |
| `bump` | `u8` | PDA bump seed |

Seeds: `["null_result", researcher_pubkey, specimen_number_le_bytes]`

#### NullBounty (One per bounty)

| Field | Type | Description |
|---|---|---|
| `creator` | `Pubkey` | Bounty poster wallet |
| `bounty_number` | `u64` | Sequential ID (NB-0001, NB-0002, ...) |
| `description` | `[u8; 256]` | Description of null result needed |
| `reward_amount` | `u64` | BIO reward in base units (6 decimals) |
| `BIO_mint` | `Pubkey` | Token mint address (BIO) |
| `vault` | `Pubkey` | Vault token account PDA |
| `deadline` | `i64` | Deadline as Unix timestamp |
| `status` | `u8` | 0 = Open, 1 = Matched, 2 = Fulfilled, 3 = Closed |
| `matched_submission` | `Pubkey` | BountySubmission PDA (zeroed if unmatched) |
| `created_at` | `i64` | Unix timestamp |
| `vault_bump` | `u8` | Vault PDA bump |
| `bump` | `u8` | PDA bump seed |

Seeds: `["null_bounty", creator_pubkey, bounty_number_le_bytes]`
Vault seeds: `["bounty_vault", bounty_pda_key]`

#### BountySubmission (Links an NKA to a bounty)

| Field | Type | Description |
|---|---|---|
| `researcher` | `Pubkey` | Claimant wallet |
| `null_result` | `Pubkey` | NullResult PDA key |
| `bounty` | `Pubkey` | NullBounty PDA key |
| `status` | `u8` | 0 = Pending, 1 = Approved, 2 = Rejected |
| `created_at` | `i64` | Unix timestamp |
| `bump` | `u8` | PDA bump seed |

Seeds: `["bounty_submission", bounty_pda_key, null_result_pda_key]`

### Instructions

| Instruction | Description |
|---|---|
| `initialize_protocol(fee_basis_points)` | One-time setup. Creates the ProtocolState singleton with counters at zero and the given fee rate. |
| `submit_null_result(hypothesis, methodology, expected_outcome, actual_outcome, p_value, sample_size, data_hash)` | Mints a new NKA. Increments `nka_counter`, creates the NullResult PDA, and records all fields. Any wallet can call this. |
| `create_bounty(description, reward_amount, deadline)` | Creates a NullBounty PDA + vault, transfers BIO from the creator's token account to the vault. Validates `reward_amount > 0`. |
| `submit_to_bounty()` | Links a researcher's NKA to an open bounty. Creates a BountySubmission PDA and transitions the bounty to Matched. Only the NKA's owner can call this. |
| `approve_bounty_submission()` | Bounty creator approves the submission. Transfers `reward - fee` BIO to the researcher and `fee` BIO to the treasury via vault CPI. Sets bounty to Fulfilled. |
| `close_bounty()` | Bounty creator reclaims escrowed BIO from any Open or Matched bounty. Vault balance returns to creator, bounty set to Closed. |

### Events

| Event | Fields |
|---|---|
| `ProtocolInitialized` | `authority`, `fee_basis_points` |
| `NullResultSubmitted` | `specimen_number`, `researcher` |
| `BountyCreated` | `bounty_number`, `creator`, `reward_amount`, `deadline` |
| `BountySubmissionCreated` | `bounty_number`, `specimen_number`, `researcher` |
| `BountyFulfilled` | `bounty_number`, `specimen_number`, `researcher`, `payout`, `fee` |
| `BountyClosed` | `bounty_number`, `creator`, `refunded_amount` |

### Errors

| Error | Description |
|---|---|
| `InvalidBountyStatus` | Bounty is not in the expected status for the operation |
| `InvalidSubmissionStatus` | Submission is not in the expected status |
| `SubmissionMismatch` | The submission PDA does not match the bounty's `matched_submission` |
| `BountyExpired` | The bounty deadline has passed |
| `InvalidRewardAmount` | Reward amount must be greater than zero |
| `FeeOverflow` | Arithmetic overflow during fee calculation |

---

## Frontend

A React 19 SPA built with Vite 7.3 and Tailwind CSS v4. Connects directly to Solana devnet -- no backend server.

### Provider Stack

```
ConnectionProvider (Solana RPC)
  -> WalletProvider (Phantom, auto-connect)
    -> WalletModalProvider
      -> ProgramProvider (Anchor Program instance)
        -> ToastProvider
          -> BrowserRouter
```

### Routes

| Route | Page | Description |
|---|---|---|
| `/` | Landing | Hero with animated Bio Protocol icons, problem/solution breakdown, how-it-works timeline, CTA sections |
| `/dashboard` | Dashboard | Protocol stats (total NKAs, bounties, open bounties, unique researchers) and full NKA registry grid |
| `/submit` | Submit | Four-step guided form: Hypothesis -> Results -> Data (file upload + SHA-256) -> Review -> Submit to chain |
| `/market` | Market | Bounty card grid with create-bounty modal |
| `/market/:bountyId` | BountyDetail | Single bounty view with submissions, approve/close actions, and NKA submission modal |
| `/nka/:specimenNumber` | NullResultDetail | Full NKA metadata with researcher info and Solana Explorer links |

### Hooks

**Data hooks** (`useProtocolState`, `useNullResults`, `useBounties`, `useBountySubmissions`) fetch accounts via `program.account.<type>.all()` and expose `{ data, loading, error, refetch }`.

**Transaction hooks** (`useSubmitNullResult`, `useCreateBounty`, `useSubmitToBounty`, `useApproveBountySubmission`, `useCloseBounty`) derive PDAs, build and send transactions, and show toast notifications for each lifecycle stage.

### Design System

Dark-mode cyberpunk aesthetic defined as Tailwind v4 `@theme` tokens:

- **Background:** `#060810` with a 40px CSS grid overlay
- **Surfaces:** `#0d1017` (surface), `#161c2a` (raised), `#232840` borders
- **Accents:** Neon cyan (`#5ec4de`), magenta (`#c8836a`), lime (`#62b862`)
- **Typography:** Cabinet Grotesk (display), Satoshi (body), Space Grotesk (mono/data)
- **Effects:** CRT scanline animation, SVG noise overlay, glass card hover lifts with colored glow shadows, scroll progress bar, pulsing status dots

---

## Bio Protocol Integration

NullGraph aligns directly with Bio Protocol's mission to build decentralized infrastructure for scientific research.

- **Shared settlement layer.** Both are built on Solana, sharing wallet ecosystem and finality guarantees.
- **BIO token economy.** The bounty marketplace uses BIO tokens for all rewards and fees, directly integrating with Bio Protocol's token ecosystem.
- **SPL Token Interface.** All token operations use the SPL Token Interface (`anchor-spl/token_interface`), ensuring compatibility with any SPL-compliant token.
- **Data provenance.** On-chain SHA-256 data hashes provide the same chain-of-custody guarantees Bio Protocol uses for research data integrity.

**Future paths:** BioDAO-funded bounties, decentralized knowledge graph indexing of NKA metadata, community verification network using the NKA status field (Pending/Verified/Disputed).

---

## Tech Stack

### On-Chain

| Technology | Version | Purpose |
|---|---|---|
| Solana | Devnet | Settlement layer |
| Anchor | 0.31.1 | Program framework |
| anchor-spl | 0.31.1 | SPL Token Interface CPI, Associated Token |
| Rust | 2021 edition | Program language |

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19.2 | UI framework |
| TypeScript | 5.9 | Type safety |
| Vite | 7.3 | Build tool + dev server |
| Tailwind CSS | 4.2 | Utility-first styling |
| React Router | 7.13 | Client-side routing |
| Lucide React | 0.575 | Icons |

### Solana Client Libraries

| Library | Purpose |
|---|---|
| `@coral-xyz/anchor` (0.32.1) | Anchor client for IDL-based program interaction |
| `@solana/web3.js` | JSON-RPC client and transaction building |
| `@solana/wallet-adapter-react` | React hooks for wallet connection |
| `@solana/wallet-adapter-react-ui` | Wallet connection modal and button |
| `@solana/wallet-adapter-wallets` | Phantom wallet adapter |
| `@solana/spl-token` | SPL Token client utilities (ATA derivation) |

---

## Project Structure

```
nullgraph/
|-- Anchor.toml                          # Anchor config (cluster, program ID, wallet)
|-- Cargo.toml                           # Rust workspace manifest
|-- programs/
|   `-- nullgraph/
|       |-- Cargo.toml
|       `-- src/
|           `-- lib.rs                   # All accounts, instructions, events, errors (~593 lines)
|-- tests/
|   `-- nullgraph.ts                     # Anchor integration tests
|-- scripts/
|   `-- init-protocol.ts                 # One-time protocol initialization script
|-- app/
|   |-- index.html
|   |-- package.json
|   |-- vite.config.ts
|   |-- tsconfig.app.json
|   `-- src/
|       |-- main.tsx                     # React DOM entry
|       |-- App.tsx                      # Provider stack + routes
|       |-- index.css                    # Tailwind v4 @theme tokens + visual effects
|       |-- types/
|       |   `-- index.ts                 # TypeScript interfaces for on-chain accounts
|       |-- lib/
|       |   |-- constants.ts             # Program ID, BIO mint, RPC URL, PDA seeds
|       |   |-- pda.ts                   # PDA derivation functions
|       |   |-- utils.ts                 # String encoding, formatting, SHA-256 hashing
|       |   |-- program.ts              # Anchor Program construction from IDL
|       |   |-- nullgraph.json           # Compiled IDL
|       |   `-- nullgraph_types.ts       # Generated TypeScript types from IDL
|       |-- context/
|       |   `-- ProgramContext.tsx        # React context providing Anchor Program instance
|       |-- hooks/
|       |   |-- useProtocolState.ts       # Fetch ProtocolState singleton
|       |   |-- useNullResults.ts         # Fetch all NullResult accounts
|       |   |-- useBounties.ts            # Fetch all NullBounty accounts
|       |   |-- useBountySubmissions.ts   # Fetch BountySubmission accounts (filterable)
|       |   |-- useSubmitNullResult.ts    # Transaction: submit_null_result
|       |   |-- useCreateBounty.ts        # Transaction: create_bounty
|       |   |-- useSubmitToBounty.ts      # Transaction: submit_to_bounty
|       |   |-- useApproveBountySubmission.ts  # Transaction: approve_bounty_submission
|       |   `-- useCloseBounty.ts         # Transaction: close_bounty
|       |-- components/
|       |   |-- layout/
|       |   |   |-- Navbar.tsx            # Fixed nav with wallet button + scroll progress
|       |   |   |-- Footer.tsx
|       |   |   |-- PageContainer.tsx
|       |   |   |-- NoiseOverlay.tsx      # CRT noise texture
|       |   |   `-- Scanline.tsx          # CRT scanline animation
|       |   |-- cards/
|       |   |   |-- NullResultCard.tsx     # NKA card
|       |   |   |-- BountyCard.tsx         # Bounty card with BIO reward
|       |   |   `-- StatCard.tsx           # Dashboard stat card
|       |   |-- forms/
|       |   |   |-- SubmitNullResultForm.tsx   # Multi-step form container
|       |   |   |-- StepHypothesis.tsx
|       |   |   |-- StepResults.tsx
|       |   |   |-- StepData.tsx
|       |   |   |-- StepReview.tsx
|       |   |   `-- CreateBountyForm.tsx
|       |   |-- ui/
|       |   |   |-- Button.tsx
|       |   |   |-- Badge.tsx
|       |   |   |-- Input.tsx
|       |   |   |-- Textarea.tsx
|       |   |   |-- Modal.tsx
|       |   |   |-- Toast.tsx
|       |   |   |-- SpecimenTag.tsx
|       |   |   |-- ProgressBar.tsx
|       |   |   |-- Spinner.tsx
|       |   |   `-- StatusDot.tsx
|       |   `-- wallet/
|       |       `-- WalletButton.tsx
|       `-- pages/
|           |-- Landing.tsx
|           |-- Dashboard.tsx
|           |-- Submit.tsx
|           |-- Market.tsx
|           |-- BountyDetail.tsx
|           `-- NullResultDetail.tsx
`-- migrations/
    `-- deploy.ts
```

---

## Getting Started

### Prerequisites

- [Rust](https://rustup.rs/) (stable)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools) (v1.18+)
- [Anchor CLI](https://www.anchor-lang.com/docs/installation) (v0.31.1)
- [Node.js](https://nodejs.org/) (v18+)
- [Phantom Wallet](https://phantom.app/) browser extension (set to devnet)

### Setup

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd app && npm install && cd ..

# Configure Solana CLI
solana config set --url devnet
```

### Build and Deploy

```bash
# Build the Anchor program
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Initialize the protocol (one-time)
npx ts-node scripts/init-protocol.ts
```

### Run the Frontend

```bash
cd app
npm run dev
# -> http://localhost:5173
```

### Rebuild IDL After Program Changes

```bash
anchor build
cp target/idl/nullgraph.json app/src/lib/nullgraph.json
cp target/types/nullgraph.ts app/src/lib/nullgraph_types.ts
```

---

## Testing

```bash
# Run against local validator (starts + stops automatically)
anchor test

# Run against existing devnet deployment
anchor test --skip-local-validator --provider.cluster devnet
```

The test suite covers the full lifecycle:

| Test | Verifies |
|---|---|
| Protocol initialization | Singleton created with correct authority, counters at zero, fee at 250 bps |
| Double-init rejection | PDA already exists -- Anchor rejects duplicate `init` |
| NKA submission | PDA created with all fields, counter increments |
| Multiple researchers | Independent submissions, counter increments correctly |
| Bounty creation + escrow | Bounty PDA + vault created, BIO escrowed |
| Bounty submission | BountySubmission PDA created, bounty transitions to Matched |
| Invalid submission | Returns `InvalidBountyStatus` when bounty is already Matched |
| Bounty approval + payout | 97.5% to researcher, 2.5% to treasury, vault empties, statuses update |
| Bounty close + refund | Full vault balance returned, bounty status becomes Closed |
| Close fulfilled bounty | Returns `InvalidBountyStatus` when bounty is already Fulfilled |

---

## Security Model

**On-Chain:**

- **Signer checks** on every write instruction via Anchor struct-level enforcement.
- **PDA ownership** -- all data accounts are program-owned PDAs.
- **`has_one` constraints** -- `submit_to_bounty` checks the NKA's researcher; `approve_bounty_submission` and `close_bounty` check the bounty's creator.
- **Status guards** -- each instruction validates current status before mutation.
- **Replay protection** -- PDA `init` constraints prevent duplicate accounts; BountySubmission PDAs are unique per bounty-NKA pair.
- **Vault authority** -- vault token accounts use the vault PDA itself as authority. Transfers only via CPI with correct signer seeds.
- **Safe arithmetic** -- all fee/payout math uses `checked_mul`, `checked_div`, `checked_sub`.
- **Transfer validation** -- all BIO transfers use `transfer_checked`, validating mint and decimal precision.

**Frontend:**

- No private keys handled. All signing delegated to Phantom.
- Client-side file hashing via Web Crypto API (`crypto.subtle.digest`).
- Input bounds match on-chain field sizes (128/256 chars via `maxLength`).

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_RPC_URL` | `https://api.devnet.solana.com` | Solana JSON-RPC endpoint |

Both are optional. Defaults point to the devnet deployment.

---

## License

MIT
