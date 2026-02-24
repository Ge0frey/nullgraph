# NullGraph

**Tokenizing the 95% of science that journals throw away.**

NullGraph is a Solana-native protocol that incentivizes the publication, verification, and monetization of negative scientific results. It converts experiments that "failed" into permanent, on-chain Null Knowledge Assets (NKAs), and provides a bounty marketplace where BioDAOs and researchers can pay for the null results they need.


**Program ID:** `2u3DXQq9A6UgMryeVSWCNdYLy3Fjh391R5hcfWYkCgZK`
**Network:** Solana Devnet

---

## Table of Contents

1. [The Problem](#the-problem)
2. [The Solution](#the-solution)
3. [Architecture Overview](#architecture-overview)
4. [On-Chain Program Design](#on-chain-program-design)
5. [Frontend Application](#frontend-application)
6. [End-to-End User Flows](#end-to-end-user-flows)
7. [Bio Protocol Integration](#bio-protocol-integration)
8. [Technology Stack](#technology-stack)
9. [Project Structure](#project-structure)
10. [Getting Started](#getting-started)
11. [Testing](#testing)
12. [Deployment](#deployment)
13. [Security Model](#security-model)
14. [Environment Variables](#environment-variables)
15. [Design Decisions and Tradeoffs](#design-decisions-and-tradeoffs)

---

## The Problem

An estimated 95% of null results in scientific research are never published. This creates a chain of compounding failures across the research ecosystem:

- **Publication bias.** Academic journals overwhelmingly favor positive results. Negative findings are systematically rejected, producing a distorted scientific record that overstates effect sizes and understates failure rates.
- **Wasted replication.** Without access to prior negative results, researchers unknowingly repeat experiments that have already been proven to fail. Entire labs spend months duplicating dead ends that could have been avoided with a five-minute lookup.
- **Lost investment.** Billions of dollars in research funding each year produces results that sit in filing cabinets, lab notebooks, and abandoned hard drives. The knowledge exists but is effectively inaccessible.
- **Zero incentive structure.** Under the current system, researchers have no career incentive, no financial incentive, and no reputational incentive to publish non-discoveries. The cost of writing up a null result is borne entirely by the researcher, and the benefit accrues to nobody.

NullGraph attacks all four problems simultaneously by making null results permanent, discoverable, and economically valuable.

---

## The Solution

NullGraph introduces three interlocking primitives built on Solana:

### 1. Null Knowledge Assets (NKAs)

A researcher submits a structured null result -- hypothesis, methodology, expected vs. actual outcome, p-value, sample size, and an optional data hash -- through a guided four-step form. On submission, the program creates an on-chain PDA (Program Derived Address) that permanently records all metadata. The researcher receives a specimen identifier (e.g., NKA-0042) and the result becomes browsable by anyone through the Dashboard.

The data hash field stores a SHA-256 fingerprint of any attached data file. The file itself stays off-chain (it is too large for on-chain storage), but the hash provides a tamper-proof chain-of-custody link between the on-chain record and the underlying dataset.

### 2. Null Bounty Marketplace

A BioDAO, pharmaceutical lab, or independent researcher can post a bounty requesting a specific null result they need. The bounty specifies what negative finding is sought, the USDC reward, and a deadline. When the bounty is created, the USDC reward is escrowed into a PDA-controlled vault on-chain -- it is no longer in the creator's wallet. This escrow mechanism ensures that the reward is guaranteed: if a valid submission is approved, the funds are always available.

A researcher with a matching NKA can submit it to the bounty. The bounty creator reviews the submission and either approves (triggering automatic USDC payout minus a protocol fee) or can close the bounty to reclaim their escrowed funds.

### 3. Protocol Fee Layer

A configurable protocol fee (set at initialization, default 2.5%) is deducted from every bounty settlement and routed to a treasury wallet. This creates a sustainable revenue model for the protocol itself without imposing any cost on the researchers who submit null results.

---

## Architecture Overview

```
                     +---------------------------+
                     |   Researcher's Browser    |
                     |   (React 19 + Vite 7.3)  |
                     +-----+---------------+-----+
                           |               |
                Write (tx) |               | Read (RPC)
                           v               v
                +----------+---------------+----------+
                |       Solana Devnet Cluster          |
                |                                      |
                |  +-------------------------------+   |
                |  |  NullGraph Anchor Program      |   |
                |  |  (2u3DXQq...CgZK)             |   |
                |  |                                |   |
                |  |  Accounts:                     |   |
                |  |   - ProtocolState (singleton)  |   |
                |  |   - NullResult PDAs            |   |
                |  |   - NullBounty PDAs            |   |
                |  |   - BountySubmission PDAs      |   |
                |  |   - Vault Token Accounts       |   |
                |  +-------------------------------+   |
                |                                      |
                |  +-------------------------------+   |
                |  |  SPL Token Program             |   |
                |  |  (USDC transfers via CPI)      |   |
                |  +-------------------------------+   |
                +--------------------------------------+
```

### What Lives On-Chain vs. Off-Chain

| Component | Location | Rationale |
|---|---|---|
| ProtocolState, NullResult, NullBounty, BountySubmission, Vault | On-chain (Anchor PDAs) | Trustless, verifiable, permanent, censorship-resistant |
| Full paper/data files (PDFs, CSVs, images) | Off-chain (referenced by SHA-256 hash stored on-chain) | Too large for Solana account storage |
| Frontend application | Off-chain (React SPA hosted on Vercel/Netlify) | Standard web deployment |

### Data Flow

1. **Writes** go through the Solana Wallet Adapter. The user signs transactions in Phantom (or any Solana wallet), which are submitted to the Anchor program. The program validates all inputs, enforces access control, and creates or mutates PDA accounts.
2. **Reads** use `getProgramAccounts` RPC calls through the Anchor client. The frontend deserializes account data using the program's IDL and renders it directly. There is no backend server, no database, and no indexer. All state is read directly from the chain.
3. **USDC transfers** are executed via Cross-Program Invocations (CPI) to the SPL Token program using `transfer_checked`, which validates the mint and decimal precision.

---

## On-Chain Program Design

The entire Anchor program lives in a single file (`programs/nullgraph/src/lib.rs`, ~593 lines). All accounts, instructions, events, and errors are co-located. The program uses Anchor 0.31.1 with `anchor-spl` for SPL Token CPI.

### Accounts

#### ProtocolState (Singleton)

The global configuration account, initialized once by the protocol authority. Stores auto-incrementing counters for NKAs and bounties, the fee rate, and the treasury address.

| Field | Type | Size | Description |
|---|---|---|---|
| `authority` | `Pubkey` | 32 | Protocol admin wallet |
| `nka_counter` | `u64` | 8 | Auto-incrementing NKA specimen counter |
| `bounty_counter` | `u64` | 8 | Auto-incrementing bounty counter |
| `fee_basis_points` | `u16` | 2 | Fee on bounty settlement (250 = 2.5%) |
| `treasury` | `Pubkey` | 32 | Treasury wallet for collected fees |
| `bump` | `u8` | 1 | PDA bump seed |

**PDA seeds:** `["protocol_state"]`
**Space:** 8 (discriminator) + 83 = 91 bytes

#### NullResult (One per submitted null result)

Each NKA is a PDA account containing the full structured metadata of a negative scientific result.

| Field | Type | Size | Description |
|---|---|---|---|
| `researcher` | `Pubkey` | 32 | Wallet of the submitting researcher |
| `specimen_number` | `u64` | 8 | Sequential identifier (NKA-0001, NKA-0002, ...) |
| `hypothesis` | `[u8; 128]` | 128 | Hypothesis tested (UTF-8, zero-padded) |
| `methodology` | `[u8; 128]` | 128 | Methodology summary |
| `expected_outcome` | `[u8; 128]` | 128 | What was expected to happen |
| `actual_outcome` | `[u8; 128]` | 128 | What actually happened |
| `p_value` | `u32` | 4 | Fixed-point representation (8700 = 0.8700) |
| `sample_size` | `u32` | 4 | Sample size n |
| `data_hash` | `[u8; 32]` | 32 | SHA-256 hash of attached data file |
| `status` | `u8` | 1 | 0 = Pending, 1 = Verified, 2 = Disputed |
| `created_at` | `i64` | 8 | Unix timestamp from Solana Clock |
| `bump` | `u8` | 1 | PDA bump seed |

**PDA seeds:** `["null_result", researcher_pubkey, specimen_number_le_bytes]`
**Space:** 8 + 602 = 610 bytes

The 128-byte field size is a deliberate choice. Solana transactions are capped at 1,232 bytes. With four 128-byte fields in `submit_null_result` (512 bytes total), plus other instruction arguments (~44 bytes), account keys, and signatures, the transaction fits comfortably within the limit while providing enough room for structured scientific summaries (~128 ASCII characters per field).

#### NullBounty (One per posted bounty)

Each bounty is a PDA that records what null result is being sought, the reward, and the lifecycle state.

| Field | Type | Size | Description |
|---|---|---|---|
| `creator` | `Pubkey` | 32 | Bounty poster wallet |
| `bounty_number` | `u64` | 8 | Sequential identifier (NB-0001, NB-0002, ...) |
| `description` | `[u8; 256]` | 256 | Description of the null result needed |
| `reward_amount` | `u64` | 8 | USDC reward in base units (6 decimals) |
| `usdc_mint` | `Pubkey` | 32 | USDC mint address |
| `vault` | `Pubkey` | 32 | Vault token account PDA address |
| `deadline` | `i64` | 8 | Deadline as Unix timestamp |
| `status` | `u8` | 1 | 0 = Open, 1 = Matched, 2 = Fulfilled, 3 = Closed |
| `matched_submission` | `Pubkey` | 32 | BountySubmission PDA key (zeroed if unmatched) |
| `created_at` | `i64` | 8 | Unix timestamp |
| `vault_bump` | `u8` | 1 | Vault PDA bump seed |
| `bump` | `u8` | 1 | PDA bump seed |

**PDA seeds:** `["null_bounty", creator_pubkey, bounty_number_le_bytes]`
**Vault PDA seeds:** `["bounty_vault", bounty_pda_key]`
**Space:** 8 + 419 = 427 bytes

The vault is a separate SPL Token Account PDA whose authority is itself. This means the vault can only sign transfers through CPI with the correct PDA seeds, making the escrow trustless.

#### BountySubmission (Links an NKA to a bounty)

| Field | Type | Size | Description |
|---|---|---|---|
| `researcher` | `Pubkey` | 32 | Claimant wallet |
| `null_result` | `Pubkey` | 32 | NullResult PDA key |
| `bounty` | `Pubkey` | 32 | NullBounty PDA key |
| `status` | `u8` | 1 | 0 = Pending, 1 = Approved, 2 = Rejected |
| `created_at` | `i64` | 8 | Unix timestamp |
| `bump` | `u8` | 1 | PDA bump seed |

**PDA seeds:** `["bounty_submission", bounty_pda_key, null_result_pda_key]`
**Space:** 8 + 106 = 114 bytes

### PDA Seeds Reference

| Account | Seeds | Uniqueness Guarantee |
|---|---|---|
| ProtocolState | `["protocol_state"]` | Singleton (one per program) |
| NullResult | `["null_result", researcher, specimen_number_le]` | One per researcher per specimen |
| NullBounty | `["null_bounty", creator, bounty_number_le]` | One per creator per bounty |
| Vault | `["bounty_vault", bounty_pda_key]` | One per bounty |
| BountySubmission | `["bounty_submission", bounty_pda_key, null_result_pda_key]` | One per bounty-NKA pair |

### Instructions

The program exposes six instructions:

#### `initialize_protocol(fee_basis_points: u16)`

Initializes the singleton `ProtocolState` PDA. Sets counters to zero, records the authority and treasury wallet, and stores the fee rate. This instruction can only be called once -- attempting to call it again fails because the PDA already exists.

#### `submit_null_result(hypothesis, methodology, expected_outcome, actual_outcome, p_value, sample_size, data_hash)`

Any wallet can call this instruction to mint a new NKA. The program atomically increments the `nka_counter` in `ProtocolState`, derives the new `NullResult` PDA using the incremented counter, and populates all fields. The `created_at` timestamp comes from the Solana Clock sysvar. The researcher's public key is baked into the PDA seeds, making each NKA permanently attributable.

#### `create_bounty(description, reward_amount, deadline)`

Creates a new `NullBounty` PDA and a companion vault token account PDA. The reward USDC is transferred from the creator's associated token account to the vault via a CPI `transfer_checked` call to the SPL Token program. This ensures the USDC is locked in escrow at creation time. The instruction validates that `reward_amount > 0`.

#### `submit_to_bounty()`

A researcher links one of their existing NKAs to an open bounty. The instruction creates a `BountySubmission` PDA and transitions the bounty status from Open to Matched. Access control is enforced via Anchor's `has_one = researcher` constraint on the `NullResult` account -- only the original researcher who submitted the NKA can submit it to a bounty.

#### `approve_bounty_submission()`

The bounty creator approves the matched submission. The program:
1. Validates that the bounty is in Matched status and the submission matches.
2. Computes the fee: `reward_amount * fee_basis_points / 10000`.
3. Computes the payout: `reward_amount - fee`.
4. Executes a CPI `transfer_checked` from the vault to the researcher's USDC ATA (payout amount).
5. Executes a CPI `transfer_checked` from the vault to the treasury's USDC ATA (fee amount).
6. Sets the bounty status to Fulfilled and the submission status to Approved.

All arithmetic uses `checked_mul`, `checked_div`, and `checked_sub` to prevent overflow.

#### `close_bounty()`

The bounty creator can reclaim escrowed USDC from any bounty that is Open or Matched (but not yet Fulfilled). The vault balance is transferred back to the creator via CPI, and the bounty status is set to Closed. This instruction is access-controlled via `has_one = creator`.

### Events

The program emits six events for off-chain indexing and UI feedback:

| Event | Fields |
|---|---|
| `ProtocolInitialized` | `authority`, `fee_basis_points` |
| `NullResultSubmitted` | `specimen_number`, `researcher` |
| `BountyCreated` | `bounty_number`, `creator`, `reward_amount`, `deadline` |
| `BountySubmissionCreated` | `bounty_number`, `specimen_number`, `researcher` |
| `BountyFulfilled` | `bounty_number`, `specimen_number`, `researcher`, `payout`, `fee` |
| `BountyClosed` | `bounty_number`, `creator`, `refunded_amount` |

### Error Codes

| Error | Description |
|---|---|
| `InvalidBountyStatus` | Bounty is not in the expected status for the attempted operation |
| `InvalidSubmissionStatus` | Submission is not in the expected status |
| `SubmissionMismatch` | The submission PDA does not match the bounty's `matched_submission` |
| `BountyExpired` | The bounty deadline has passed |
| `InvalidRewardAmount` | Reward amount must be greater than zero |
| `FeeOverflow` | Arithmetic overflow during fee calculation |

### Rent and Space Summary

| Account | Bytes | Approximate Rent (SOL) |
|---|---|---|
| ProtocolState | 91 | 0.001 |
| NullResult | 610 | 0.004 |
| NullBounty | 427 | 0.003 |
| Vault (TokenAccount) | 165 | 0.002 |
| BountySubmission | 114 | 0.001 |

---

## Frontend Application

The frontend is a React 19 single-page application built with Vite 7.3 and Tailwind CSS v4. It connects directly to the Solana devnet cluster -- there is no backend server.

### Provider Stack

The application wraps the component tree in a series of nested providers (defined in `App.tsx`):

```
ConnectionProvider (Solana RPC endpoint)
  -> WalletProvider (Phantom adapter, auto-connect)
    -> WalletModalProvider (wallet selection UI)
      -> ProgramProvider (Anchor Program instance)
        -> ToastProvider (notification system)
          -> BrowserRouter (client-side routing)
```

The `ProgramProvider` (`context/ProgramContext.tsx`) constructs an `AnchorProvider` from the wallet adapter context and instantiates the `Program` object using the compiled IDL. This program instance is consumed by all hooks via `useProgram()`.

### Pages and Routes

| Route | Page | Description |
|---|---|---|
| `/` | Landing | Hero section, problem/solution explanation, how-it-works timeline, tech stack badges, call-to-action |
| `/dashboard` | Dashboard | Protocol statistics row (total NKAs, total bounties, open bounties, unique researchers) and full NKA registry grid |
| `/submit` | Submit | Four-step guided form to submit a null result on-chain |
| `/market` | Market | Bounty card grid showing all posted bounties, with a modal to create new bounties |
| `/market/:bountyId` | BountyDetail | Detailed view of a single bounty with its submissions, approve/close actions |
| `/nka/:specimenNumber` | NullResultDetail | Full metadata view of a single NKA with chain-of-custody details and Explorer links |

### State Management

The application uses React Context plus custom hooks exclusively. There is no Redux or external state library.

**Data hooks** (`useNullResults`, `useBounties`, `useBountySubmissions`, `useProtocolState`) each manage their own `useState`/`useEffect` cycle. They call `program.account.<type>.all()` (which maps to `getProgramAccounts` RPC) on mount and expose `{ data, loading, error, refetch }`. Filtering (e.g., "my NKAs") uses `memcmp` filters at the RPC level.

**Transaction hooks** (`useSubmitNullResult`, `useCreateBounty`, `useSubmitToBounty`, `useApproveBountySubmission`, `useCloseBounty`) return async functions that:
1. Fetch any required on-chain state (e.g., current counter for PDA derivation).
2. Derive all necessary PDAs.
3. Build and send the transaction via `program.methods.<instruction>().accounts({...}).rpc()`.
4. Show toast notifications for each lifecycle stage (awaiting approval, submitted, confirmed, error).
5. Return success/failure to the calling component.

### Design System

The UI is built on a dark-mode-first design system defined as Tailwind v4 `@theme` tokens in `index.css`:

- **Background:** `#060608` (near-black) with a subtle micro-grid pattern (24px CSS grid lines at 0.02 opacity).
- **Surfaces:** `#0c0c12` (surface) and `#12121c` (raised surface), separated by `#1e1e2a` borders.
- **Accent colors:**
  - Null-amber (`#ffb347`) for null results and specimen tags.
  - Archive-green (`#7aff94`) for CTAs and verified states.
  - Bio-green (`#00ff88`) for wallet and Bio Protocol elements.
  - Warning-red (`#ff4d4d`) for errors and disputes.
  - Info-blue (`#4da6ff`) for bounty identifiers and links.
- **Typography:** DM Sans (display headings, 700/800 weight), IBM Plex Sans (body text, 400/500/600), IBM Plex Mono (data values, tags, technical content).
- **Visual textures:** SVG noise overlay at 0.018 opacity, 45-degree hatching pattern on NKA cards, pulsing status dots.

---

## End-to-End User Flows

### Flow 1: Submitting a Null Result

1. The researcher navigates to `/submit` and connects their Phantom wallet (devnet).
2. **Step 1 -- Hypothesis.** The researcher enters the hypothesis they tested and the methodology they used. Each field supports up to 128 characters.
3. **Step 2 -- Results.** The researcher enters what they expected to observe and what actually happened, along with the p-value (as a decimal, e.g., 0.87) and sample size (as an integer).
4. **Step 3 -- Data.** The researcher optionally uploads a data file (CSV, PDF, JSON, etc.). The frontend computes a SHA-256 hash of the file client-side using the Web Crypto API. The hash is stored on-chain; the file itself is not uploaded anywhere in the current version.
5. **Step 4 -- Review.** The researcher reviews all fields in a summary view.
6. On clicking "Submit to Chain," the frontend:
   - Fetches the current `nka_counter` from `ProtocolState`.
   - Derives the `NullResult` PDA using `counter + 1`.
   - Encodes all string fields as zero-padded `[u8; 128]` arrays.
   - Converts the p-value from decimal to fixed-point (0.87 becomes 8700).
   - Calls `program.methods.submitNullResult(...).accounts({...}).rpc()`.
7. Phantom prompts the researcher to sign the transaction.
8. On confirmation, a success toast appears with the specimen number (e.g., NKA-0001) and a link to the Solana Explorer transaction.
9. The researcher is redirected to `/nka/:specimenNumber` to view their newly minted NKA.

### Flow 2: Browsing Null Results

1. Any user (wallet connection optional for reading) navigates to `/dashboard`.
2. The dashboard displays a statistics row showing total NKAs, total bounties, open bounties, and unique researchers.
3. Below the stats, a registry grid shows all published null results sorted by specimen number (newest first). Each card shows the specimen tag (NKA-XXXX), the hypothesis, the status badge (Pending/Verified/Disputed), and the creation date.
4. Clicking any card navigates to `/nka/:specimenNumber`, which shows the full metadata: hypothesis, methodology, expected outcome, actual outcome, p-value, sample size, data hash, researcher address (linked to Explorer), creation timestamp, and on-chain address (linked to Explorer).

### Flow 3: Creating a Bounty

1. A BioDAO or researcher navigates to `/market` and connects their wallet.
2. They click "Create Bounty," which opens a modal form.
3. They enter: a description of the null result they need (up to 256 characters), the USDC reward amount, and a deadline in days from now.
4. On clicking "Deposit USDC & Create Bounty," the frontend:
   - Fetches the current `bounty_counter` from `ProtocolState`.
   - Derives the `NullBounty` PDA and the companion `Vault` PDA.
   - Resolves the creator's USDC associated token account.
   - Calls `program.methods.createBounty(...)` which atomically creates the bounty PDA, creates the vault token account, and transfers USDC from the creator to the vault.
5. The bounty appears in the marketplace grid with an "Open" badge.

### Flow 4: Fulfilling a Bounty

1. A researcher browses `/market` and finds a bounty matching one of their null results.
2. They click into the bounty detail page (`/market/:bountyId`).
3. They click "Submit Your NKA," which opens a modal listing their NKAs.
4. They select the relevant NKA. The frontend calls `program.methods.submitToBounty()`, creating a `BountySubmission` PDA and setting the bounty status to Matched.
5. The bounty creator sees the submission on the bounty detail page.
6. The bounty creator clicks "Approve Submission." The program:
   - Transfers `reward_amount - fee` USDC from the vault to the researcher.
   - Transfers `fee` USDC from the vault to the treasury.
   - Sets the bounty to Fulfilled and the submission to Approved.
7. A success toast confirms the transfer with amounts and a transaction link.

### Flow 5: Closing a Bounty

1. The bounty creator navigates to their bounty's detail page.
2. They click "Close & Refund."
3. The program transfers the full vault balance back to the creator's USDC ATA and sets the bounty status to Closed.
4. The bounty card in the marketplace updates to show a "Closed" badge.

---

### Alignment with Bio Protocol's Mission

Bio Protocol aims to create decentralized infrastructure for scientific research. NullGraph directly extends this vision by addressing the publication bias problem -- one of the most well-documented systemic failures in modern science. By tokenizing null results on Solana, NullGraph creates a new class of scientific asset that did not previously exist in either the traditional publishing system or the DeSci ecosystem.

### Shared Infrastructure

- **Solana as settlement layer.** Both NullGraph and Bio Protocol are built on Solana, sharing the same transaction throughput, finality guarantees, and wallet ecosystem. Any Solana wallet that works with Bio Protocol works with NullGraph.
- **USDC as the unit of account.** The bounty marketplace uses USDC (devnet mint: `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`) for all rewards and fees, aligning with DeSci conventions for stablecoin-denominated research funding.
- **SPL Token standard.** All token operations use the SPL Token Interface (`anchor-spl`), ensuring compatibility with any SPL-compliant token or tooling in the Bio Protocol ecosystem.

### Data Integrity and Provenance

NullGraph's on-chain data hash field (`[u8; 32]` SHA-256) provides the same kind of chain-of-custody guarantee that Bio Protocol uses for research data provenance. Every NKA records who submitted it, when, and a cryptographic fingerprint of the underlying data -- creating an immutable audit trail that is exactly the kind of metadata a Bio Protocol integration would consume.

### Future Integration Paths

- **BioDAO bounty funding.** A BioDAO on Bio Protocol could directly fund NullGraph bounties for null results relevant to their research agenda. The USDC escrow mechanism is already compatible.
- **DKG (Decentralized Knowledge Graph).** NKA metadata (hypothesis, methodology, outcome, p-value) is structured in a way that could be indexed into a decentralized knowledge graph, making null results searchable across the Bio Protocol ecosystem.
- **Verification network.** The NKA status field (Pending / Verified / Disputed) is designed to accommodate a community verification layer where Bio Protocol participants review and attest to the validity of submitted null results.

---

## Technology Stack

### On-Chain

| Technology | Version | Purpose |
|---|---|---|
| Solana | Devnet | Settlement layer and data availability |
| Anchor | 0.31.1 | Solana program framework (accounts, instructions, CPI, PDAs) |
| anchor-spl | 0.31.1 | SPL Token CPI helpers (`transfer_checked`, Token Interface) |
| Rust | 2021 edition | Program language |

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19.2 | UI framework |
| TypeScript | 5.9 | Type safety |
| Vite | 7.3 | Build tool and dev server |
| Tailwind CSS | 4.2 | Utility-first styling with `@theme` design tokens |
| React Router | 7.13 | Client-side routing |
| Lucide React | 0.575 | Icon library |

### Solana Client Libraries

| Library | Purpose |
|---|---|
| `@coral-xyz/anchor` | Anchor client for IDL-based program interaction |
| `@solana/web3.js` | Solana JSON-RPC client and transaction building |
| `@solana/wallet-adapter-react` | React hooks for wallet connection |
| `@solana/wallet-adapter-react-ui` | Pre-built wallet connection modal and button |
| `@solana/wallet-adapter-wallets` | Phantom wallet adapter |
| `@solana/spl-token` | SPL Token client utilities (ATA derivation, account queries) |

### Dev Tooling

| Tool | Purpose |
|---|---|
| `vite-plugin-node-polyfills` | Buffer/crypto polyfills required by `@solana/web3.js` in browser |
| Mocha + Chai | Anchor program test runner |
| ESLint | Frontend linting |
| SWC | TypeScript/JSX transpilation (via `@vitejs/plugin-react-swc`) |

---

## Project Structure

```
nullgraph/
|-- Anchor.toml                          # Anchor config (cluster, program ID, wallet)
|-- Cargo.toml                           # Rust workspace manifest
|-- programs/
|   `-- nullgraph/
|       |-- Cargo.toml                   # Program dependencies (anchor-lang, anchor-spl)
|       `-- src/
|           `-- lib.rs                   # All accounts, instructions, events, errors (~593 lines)
|-- tests/
|   `-- nullgraph.ts                     # Anchor integration tests (8 test cases)
|-- app/
|   |-- index.html                       # Entry HTML (Google Fonts, meta tags)
|   |-- package.json                     # Frontend dependencies
|   |-- vite.config.ts                   # Vite config (Tailwind, SWC, node polyfills)
|   |-- tsconfig.app.json                # TypeScript config
|   `-- src/
|       |-- main.tsx                     # React DOM entry point
|       |-- App.tsx                      # Provider stack and route definitions
|       |-- index.css                    # Tailwind v4 @theme tokens and global textures
|       |-- types/
|       |   `-- index.ts                 # TypeScript interfaces for on-chain accounts
|       |-- lib/
|       |   |-- constants.ts             # Program ID, USDC mint, RPC URL, PDA seed strings
|       |   |-- pda.ts                   # PDA derivation functions (5 functions)
|       |   |-- utils.ts                 # String encoding/decoding, formatting, SHA-256 hashing
|       |   |-- program.ts              # Anchor Program construction from IDL
|       |   |-- nullgraph.json           # Compiled IDL (copied from anchor build)
|       |   `-- nullgraph_types.ts       # Generated TypeScript types from IDL
|       |-- context/
|       |   `-- ProgramContext.tsx        # React context providing Anchor Program instance
|       |-- hooks/
|       |   |-- useProtocolState.ts       # Fetch the ProtocolState singleton
|       |   |-- useNullResults.ts         # Fetch all NullResult accounts
|       |   |-- useBounties.ts            # Fetch all NullBounty accounts
|       |   |-- useBountySubmissions.ts   # Fetch BountySubmission accounts (with optional filter)
|       |   |-- useSubmitNullResult.ts    # Transaction: submit_null_result
|       |   |-- useCreateBounty.ts        # Transaction: create_bounty
|       |   |-- useSubmitToBounty.ts      # Transaction: submit_to_bounty
|       |   |-- useApproveBountySubmission.ts  # Transaction: approve_bounty_submission
|       |   `-- useCloseBounty.ts         # Transaction: close_bounty
|       |-- components/
|       |   |-- layout/
|       |   |   |-- Navbar.tsx            # Fixed top navigation with wallet button
|       |   |   |-- Footer.tsx            # Page footer
|       |   |   |-- PageContainer.tsx     # Centered max-width content wrapper
|       |   |   `-- NoiseOverlay.tsx      # Full-viewport SVG noise texture
|       |   |-- cards/
|       |   |   |-- NullResultCard.tsx     # NKA card with amber left border and hatching
|       |   |   |-- BountyCard.tsx         # Bounty card with reward amount and status
|       |   |   `-- StatCard.tsx           # Statistics card with accent top border
|       |   |-- forms/
|       |   |   |-- SubmitNullResultForm.tsx   # Multi-step form container with progress bar
|       |   |   |-- StepHypothesis.tsx     # Step 1: hypothesis and methodology
|       |   |   |-- StepResults.tsx        # Step 2: outcomes, p-value, sample size
|       |   |   |-- StepData.tsx           # Step 3: file upload and SHA-256 hashing
|       |   |   |-- StepReview.tsx         # Step 4: summary before submission
|       |   |   `-- CreateBountyForm.tsx   # Bounty creation form (used in modal)
|       |   |-- ui/
|       |   |   |-- Button.tsx             # Multi-variant button (primary/amber/ghost/danger)
|       |   |   |-- Badge.tsx              # Status badges (pending/verified/open/matched/...)
|       |   |   |-- Input.tsx              # Styled text input with label and error state
|       |   |   |-- Textarea.tsx           # Styled textarea with label and error state
|       |   |   |-- Modal.tsx              # Overlay modal with backdrop blur
|       |   |   |-- Toast.tsx              # Toast notification system (context + provider)
|       |   |   |-- SpecimenTag.tsx         # NKA-XXXX / NB-XXXX identifier tag
|       |   |   |-- ProgressBar.tsx        # Step progress indicator bar
|       |   |   |-- Spinner.tsx            # Loading spinner
|       |   |   `-- StatusDot.tsx          # Pulsing 8px status indicator
|       |   `-- wallet/
|       |       `-- WalletButton.tsx       # Wallet adapter multi-button wrapper
|       `-- pages/
|           |-- Landing.tsx               # Landing page (hero, problem, solution, how-it-works, CTA)
|           |-- Dashboard.tsx             # Stats row and NKA registry grid
|           |-- Submit.tsx                # Null result submission page
|           |-- Market.tsx                # Bounty marketplace grid with create modal
|           |-- BountyDetail.tsx          # Single bounty view with submissions and actions
|           `-- NullResultDetail.tsx      # Single NKA view with full metadata
`-- migrations/
    `-- deploy.ts                        # Anchor deployment script
```

---

## Getting Started

### Prerequisites

- [Rust](https://rustup.rs/) (stable toolchain)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools) (v1.18+)
- [Anchor CLI](https://www.anchor-lang.com/docs/installation) (v0.31.1)
- [Node.js](https://nodejs.org/) (v18+)
- [Phantom Wallet](https://phantom.app/) browser extension (set to devnet)

### 1. Clone and install dependencies

```bash
git clone <repository-url>
cd nullgraph

# Install root dependencies (Anchor test tooling)
yarn install

# Install frontend dependencies
cd app
npm install
cd ..
```

### 2. Configure Solana CLI for devnet

```bash
solana config set --url devnet

# Generate a keypair for deployment if you don't have one
solana-keygen new -o ~/.config/solana/nullgraph.json

# Airdrop devnet SOL
solana airdrop 5 ~/.config/solana/nullgraph.json --url devnet
```

### 3. Build the Anchor program

```bash
anchor build
```

This compiles the Rust program and generates the IDL at `target/idl/nullgraph.json` and TypeScript types at `target/types/nullgraph.ts`. The IDL is also available at `app/src/lib/nullgraph.json` for the frontend.

### 4. Deploy to devnet

```bash
anchor deploy --provider.cluster devnet
```

### 5. Initialize the protocol (one-time)

After deploying, call `initialize_protocol` once to create the `ProtocolState` singleton. This can be done via the Anchor test suite:

```bash
anchor test --skip-local-validator
```

Or write a one-off script using the Anchor client to call `initializeProtocol(250)` with your treasury wallet address.

### 6. Start the frontend

```bash
cd app
npm run dev
```

The dev server starts at `http://localhost:5173`. Connect Phantom (set to devnet) and you should see the NullGraph landing page.

### 7. Rebuild IDL after program changes

If you modify `lib.rs`, rebuild and copy the updated IDL to the frontend:

```bash
anchor build
cp target/idl/nullgraph.json app/src/lib/nullgraph.json
cp target/types/nullgraph.ts app/src/lib/nullgraph_types.ts
```

---

## Testing

### Anchor Program Tests

The test suite (`tests/nullgraph.ts`) contains 8 integration tests that run against a local Solana validator. The tests cover the complete lifecycle of both NKAs and bounties:

| Test | What It Verifies |
|---|---|
| `initialize_protocol creates ProtocolState with correct values` | Singleton created with correct authority, counters at zero, fee at 250 bps, treasury set |
| `initialize_protocol fails on second call` | PDA already exists -- Anchor rejects the duplicate `init` |
| `submit_null_result creates NKA with correct fields` | NKA PDA created, all fields match inputs, counter increments to 1 |
| `multiple researchers can submit independently` | Second NKA works, counter increments to 2 |
| `create_bounty creates bounty + vault, escrows USDC` | Bounty PDA created, vault holds exact USDC, counter increments |
| `submit_to_bounty creates submission and sets bounty to Matched` | BountySubmission PDA created, bounty status transitions to Matched |
| `submit_to_bounty fails if bounty not Open` | Returns error `InvalidBountyStatus` when bounty is already Matched |
| `approve_bounty_submission transfers correct payout + fee` | 97.5% goes to researcher, 2.5% goes to treasury, vault empties, statuses update |
| `close_bounty refunds full amount to creator` | Full vault balance returned, bounty status becomes Closed |
| `close_bounty fails if already Fulfilled` | Returns error `InvalidBountyStatus` when bounty is already Fulfilled |

To run the tests:

```bash
anchor test
```

This starts a local validator, deploys the program, runs all tests, and shuts down the validator. For testing against an existing devnet deployment:

```bash
anchor test --skip-local-validator --provider.cluster devnet
```

### Frontend Manual Test Checklist

- Wallet connects and disconnects cleanly via Phantom (devnet)
- Submit form validates required fields and prevents advancing with empty inputs
- Submitting a null result creates an on-chain NKA visible on the Dashboard
- Dashboard loads and displays all NKAs with correct specimen numbers
- NKA detail page shows all metadata fields and Solana Explorer links
- Creating a bounty escrows the specified USDC amount
- Marketplace shows all bounties with correct status badges
- Submitting an NKA to a bounty transitions the bounty to Matched
- Approving a submission transfers USDC and updates statuses
- Closing a bounty refunds USDC to the creator
- All routes navigate correctly via navbar and internal links
- Toast notifications appear for transaction lifecycle events
- Responsive layout works at 375px, 768px, and 1280px viewports

---

## Deployment

### Program Deployment

```bash
# Ensure sufficient devnet SOL
solana balance ~/.config/solana/nullgraph.json --url devnet

# Build and deploy
anchor build
anchor deploy --provider.cluster devnet

# Verify deployment
solana program show 2u3DXQq9A6UgMryeVSWCNdYLy3Fjh391R5hcfWYkCgZK --url devnet
```

### Frontend Deployment

```bash
cd app
npm run build
```

This outputs a production build to `app/dist/`. Deploy the `dist/` directory to any static hosting provider (Vercel, Netlify, Cloudflare Pages). Configure the environment variables listed below.

---

## Security Model

### On-Chain Access Control

- **Signer checks.** Every write instruction requires a `Signer` account. Anchor enforces this at the struct level -- transactions without valid signatures are rejected before instruction logic runs.
- **PDA ownership.** All data accounts are PDAs owned by the NullGraph program. They cannot be modified by any other program or by direct SOL transfer.
- **`has_one` constraints.** `submit_to_bounty` enforces that the signer is the NKA's researcher. `approve_bounty_submission` and `close_bounty` enforce that the signer is the bounty's creator.
- **Status transition guards.** Each instruction validates the current status before mutating. `submit_to_bounty` requires `status == Open`. `approve_bounty_submission` requires `status == Matched`. `close_bounty` requires `status == Open || Matched`.
- **Replay protection.** PDA `init` constraints fail if the account already exists. Each `BountySubmission` PDA is unique per bounty-NKA pair, preventing double submissions.
- **Vault authority.** Vault token accounts use the vault PDA itself as their authority (`token::authority = vault`). Transfers from the vault can only occur via CPI with the correct PDA signer seeds. No external wallet or account can move funds out of a vault.
- **Safe arithmetic.** All fee and payout calculations use Rust's `checked_mul`, `checked_div`, and `checked_sub` to prevent integer overflow or underflow.
- **Transfer validation.** All USDC transfers use `transfer_checked`, which validates the mint address and decimal precision, preventing transfers of the wrong token.

### Frontend Security

- **No private keys.** The frontend never handles private keys. All signing is delegated to the wallet adapter (Phantom), which signs transactions in an isolated context.
- **Client-side hashing.** File hashing uses the Web Crypto API (`crypto.subtle.digest`), which runs in the browser sandbox. File contents are never transmitted to any server.
- **Input bounds.** String fields are capped at 128/256 characters in the UI via `maxLength` attributes, matching the on-chain field sizes exactly.

---

## Environment Variables

| Variable | Default | Required | Description |
|---|---|---|---|
| `VITE_RPC_URL` | `https://api.devnet.solana.com` | No | Solana JSON-RPC endpoint URL |
| `VITE_PROGRAM_ID` | `2u3DXQq9A6UgMryeVSWCNdYLy3Fjh391R5hcfWYkCgZK` | No | NullGraph program ID on the target cluster |

Both variables are optional. If unset, the defaults point to the devnet deployment.

---

## Design Decisions and Tradeoffs

### Single `lib.rs` file

The entire Anchor program is in one file (~593 lines). For a production system, this would be split into modules (`state.rs`, `instructions/`, `errors.rs`, etc.). For co-locating everything eliminates import management and makes the program easy to review in a single read.

### Fixed-size byte arrays instead of strings

Solana accounts have fixed sizes determined at creation time. Using `String` (which is variable-length) would require either predicting the maximum length upfront and wasting space when strings are shorter, or using reallocation which adds complexity. Fixed `[u8; 128]` arrays are zero-padded on write and trimmed at the first null byte on read. This is simple, predictable, and avoids reallocation entirely.

### 128-byte field limit

Solana transactions are capped at 1,232 bytes. With four 128-byte fields in `submit_null_result` (512 bytes total), plus other arguments, account keys, and signatures, the transaction fits comfortably within the limit. Larger fields (e.g., 256 bytes per string) would push the total transaction size past the cap.

### No indexer or backend

All reads go directly to `getProgramAccounts` RPC. For a production system with thousands of accounts, an indexer (e.g., Helius DAS or a Geyser plugin) would replace the direct RPC scan.

### `Box<Account>` for large instruction contexts

The `ApproveBountySubmission` instruction context references four large PDA accounts (NullBounty at 427 bytes, NullResult at 610 bytes, BountySubmission at 114 bytes, ProtocolState at 91 bytes). Without boxing, the combined stack frame exceeds Solana's 4,096-byte stack limit. Boxing moves the account data to the heap, which resolves the issue with no meaningful runtime cost.

### Vault PDA as its own authority

The vault token account's authority is the vault PDA itself. This eliminates the need for a separate authority account and simplifies the CPI signing pattern: the vault signs transfers using its own PDA seeds. This is a standard Anchor pattern for trustless escrow.

### USDC on devnet

The bounty marketplace uses devnet USDC (mint: `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`). This is the standard devnet USDC mint recognized by most Solana devnet tooling. For mainnet deployment, the real USDC mint address would be substituted.

---

## License

MIT