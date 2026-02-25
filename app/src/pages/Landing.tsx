import { Link } from "react-router-dom";
import {
  FlaskConical,
  Search,
  DollarSign,
  Shield,
  ArrowRight,
  Database,
  Layers,
  Zap,
  Lock,
  FileX2,
  Eye,
  Coins,
  CheckCircle,
  Terminal,
  Copy,
} from "lucide-react";
import { useState } from "react";

/* ── Inline Bio Protocol Icon (light green, simplified) ────────────── */
function BioIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 512 513"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M17.95 494.47c-5.87-6.14-10.37-13.4-13.27-21.38-2.9-7.98-4.11-16.46-3.55-24.91.55-8.45 2.87-16.72 6.79-24.22 3.92-7.53 9.35-14.14 15.96-19.43 19.4-14.01 33.86-14.66 50.47-18.64 28.22-6.82 52.5-28.12 48.1-59.34-7.24-51.21-71.16-30.51-71.16-70.19 0-39.67 63.82-18.98 71.16-70.13 4.4-31 -19.87-52.34-48.1-59.34-16.61-3.98-31.07-4.69-50.42-18.69C17.32 102.91 11.87 96.28 7.95 88.77 4.03 81.22 1.71 72.98 1.16 64.5.6 56.05 1.81 47.54 4.71 39.57c2.9-7.98 7.43-15.24 13.3-21.38 6.13-5.87 13.4-10.4 21.35-13.3 7.95-2.9 16.45-4.1 24.91-3.55 8.45.55 16.69 2.87 22.22 6.79 7.5 3.92 14.14 9.37 19.43 16 14.01 19.4 14.72 33.88 18.69 50.49 6.82 28.25 28.12 52.52 59.31 48.13 51.13-7.24 30.42-71.21 70.1-71.21 39.62 0 18.98 63.9 70.16 71.21 30.96 4.4 52.26-19.87 59.31-48.13 3.98-16.61 4.66-31.07 18.61-50.49 5.29-6.61 11.93-12.06 19.43-15.98 7.5-3.92 15.77-6.24 24.22-6.79 8.45-.55 16.93.65 24.91 3.55 7.95 2.9 15.21 7.43 21.35 13.3 5.87 6.11 10.4 13.4 13.3 21.38 2.89 7.97 4.1 16.45 3.55 24.9-.55 8.45-2.87 16.72-6.79 24.25-3.93 7.53-9.37 14.14-15.98 19.41-19.4 14.01-33.85 14.71-50.42 18.69-28.3 6.77-52.55 28.06-48.15 59.34 7.24 51.13 71.16 30.37 71.16 70.11 0 39.7-63.87 18.98-71.16 70.19-4.4 30.99 19.87 52.26 48.15 59.05 16.53 4.03 31.07 4.69 50.42 18.69 6.61 5.29 12.06 11.93 15.98 19.43 3.92 7.53 6.24 15.77 6.79 24.25.56 8.45-.65 16.95-3.55 24.93-2.9 7.98-7.43 15.24-13.3 21.38-6.11 5.87-13.4 10.4-21.35 13.3-7.98 2.89-16.46 4.1-24.91 3.55-8.45-.55-16.72-2.87-24.22-6.79-7.5-3.92-14.14-9.37-19.43-15.98-14.01-19.44-14.64-33.88-18.61-50.49-6.82-28.25-28.12-52.52-59.31-48.13-51.18 7.24-30.49 71.21-70.16 71.21-39.67 0-18.98-63.9-70.1-71.21-30.96-4.4-52.26 19.87-59.31 48.18-3.98 16.56-4.69 31.07-18.69 50.44-5.29 6.63-11.91 12.11-19.43 16.03-7.5 3.92-15.77 6.24-24.22 6.79-8.45.55-16.93-.65-24.91-3.55-7.98-2.9-15.24-7.43-21.35-13.3"
        fill="currentColor"
      />
    </svg>
  );
}

/* ── Solana Logo (simple monochrome) ──────────────────────────────── */
function SolanaIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 397.7 311.7" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" />
      <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" />
      <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" />
    </svg>
  );
}

/* ── Code Block Component ─────────────────────────────────────────── */
function CodeBlock() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Window chrome */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-[10px] font-mono font-bold text-text-tertiary uppercase tracking-widest">
          nullgraph / lib / submit.rs
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold text-text-tertiary hover:text-text-secondary hover:bg-surface-raised transition-cyber uppercase tracking-wider"
        >
          <Copy className="w-3 h-3" />
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      {/* Code content */}
      <div className="p-5 overflow-x-auto">
        <pre className="text-[12px] sm:text-[13px] font-mono leading-relaxed">
          <code>
            <Line kw="pub fn " fn="submit_null_result" paren="(" />
            <Line indent={1} arg="ctx" punct=": Context<" type="SubmitNullResult" punct2=">," />
            <Line indent={1} arg="hypothesis" punct=": [" type="u8" punct2="; 128]," />
            <Line indent={1} arg="methodology" punct=": [" type="u8" punct2="; 128]," />
            <Line indent={1} arg="p_value" punct=": " type="u32" punct2="," />
            <Line indent={1} arg="sample_size" punct=": " type="u32" punct2="," />
            <Line indent={1} arg="data_hash" punct=": [" type="u8" punct2="; 32]," />
            <Line kw={") -> Result<"} type="()" kw2=">" plain=" {" />
            <Line indent={1} kw="let " plain="result = &" kw2="mut " plain2="ctx.accounts.null_result;" />
            <Line indent={1} plain="result.researcher = ctx.accounts.researcher." fn="key" paren="();" />
            <Line indent={1} plain="result.hypothesis = hypothesis;" />
            <Line indent={1} plain="result.specimen_number = state.nka_counter;" />
            <Line indent={1} plain="result.created_at = " fn="Clock" punct="::" fn2="get" paren="()?." plain2="unix_timestamp;" />
            <Line />
            <Line indent={1} comment="// Increment protocol counter" />
            <Line indent={1} plain="state.nka_counter += " num="1" plain2=";" />
            <Line indent={1} kw="Ok" paren="(())" />
            <Line plain="}" />
          </code>
        </pre>
      </div>
    </div>
  );
}

const codeString = `pub fn submit_null_result(
    ctx: Context<SubmitNullResult>,
    hypothesis: [u8; 128],
    methodology: [u8; 128],
    p_value: u32,
    sample_size: u32,
    data_hash: [u8; 32],
) -> Result<()> {
    let result = &mut ctx.accounts.null_result;
    result.researcher = ctx.accounts.researcher.key();
    result.hypothesis = hypothesis;
    result.specimen_number = state.nka_counter;
    result.created_at = Clock::get()?.unix_timestamp;

    // Increment protocol counter
    state.nka_counter += 1;
    Ok(())
}`;

/* ── Syntax-highlighted line helper ───────────────────────────────── */
function Line({
  indent = 0,
  kw,
  kw2,
  fn: fnName,
  fn2,
  type: typeName,
  arg,
  plain,
  plain2,
  punct,
  punct2,
  paren,
  num,
  str,
  comment,
}: {
  indent?: number;
  kw?: string;
  kw2?: string;
  fn?: string;
  fn2?: string;
  type?: string;
  arg?: string;
  plain?: string;
  plain2?: string;
  punct?: string;
  punct2?: string;
  paren?: string;
  num?: string;
  str?: string;
  comment?: string;
}) {
  const pad = "  ".repeat(indent);
  if (!kw && !fnName && !typeName && !arg && !plain && !paren && !comment && !num && !str) {
    return <span className="block">{"\n"}</span>;
  }
  return (
    <span className="block">
      <span className="text-text-tertiary">{pad}</span>
      {kw && <span className="text-neon-magenta">{kw}</span>}
      {fnName && <span className="text-neon-cyan">{fnName}</span>}
      {paren && <span className="text-text-tertiary">{paren}</span>}
      {arg && <span className="text-text-primary">{arg}</span>}
      {punct && <span className="text-text-tertiary">{punct}</span>}
      {typeName && <span className="text-neon-lime">{typeName}</span>}
      {punct2 && <span className="text-text-tertiary">{punct2}</span>}
      {kw2 && <span className="text-neon-magenta">{kw2}</span>}
      {fn2 && <span className="text-neon-cyan">{fn2}</span>}
      {plain && <span className="text-text-secondary">{plain}</span>}
      {num && <span className="text-neon-lime">{num}</span>}
      {str && <span className="text-neon-lime">{str}</span>}
      {plain2 && <span className="text-text-secondary">{plain2}</span>}
      {comment && <span className="text-text-tertiary/60 italic">{comment}</span>}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */

export function Landing() {
  return (
    <div className="min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center px-4 overflow-hidden">
        {/* Ambient gradient washes */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(94,196,222,0.08)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(200,131,106,0.06)_0%,transparent_50%)]" />

        {/* ── Animated Bio Protocol Icon Composition ────────── */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {/* Primary — massive centered icon, slow rotation */}
          <div
            className="absolute top-1/2 left-1/2"
            style={{
              animation: "bio-rotate 120s linear infinite, bio-breathe 8s ease-in-out infinite",
              "--breathe-min": "0.07",
              "--breathe-max": "0.14",
              filter: "drop-shadow(0 0 40px rgba(98, 184, 98, 0.35))",
            } as React.CSSProperties}
          >
            <BioIcon className="w-[600px] h-[600px] sm:w-[750px] sm:h-[750px] lg:w-[850px] lg:h-[850px] text-[#62b862]" />
          </div>

          {/* Secondary — top-right, drifting */}
          <div
            className="absolute top-[8%] right-[-5%] lg:right-[2%] opacity-[0.09]"
            style={{
              animation: "bio-drift 10s ease-in-out infinite",
              filter: "drop-shadow(0 0 30px rgba(94, 196, 222, 0.4))",
            }}
          >
            <BioIcon className="w-[280px] h-[280px] lg:w-[360px] lg:h-[360px] text-[#5ec4de]" />
          </div>

          {/* Tertiary — bottom-left, counter-drift */}
          <div
            className="absolute bottom-[5%] left-[-8%] lg:left-[0%] opacity-[0.07]"
            style={{
              animation: "bio-drift-reverse 12s ease-in-out infinite",
              filter: "drop-shadow(0 0 30px rgba(200, 131, 106, 0.4))",
            }}
          >
            <BioIcon className="w-[220px] h-[220px] lg:w-[300px] lg:h-[300px] text-[#c8836a]" />
          </div>

          {/* Radial glow behind primary icon */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] lg:w-[900px] lg:h-[900px] rounded-full bg-[radial-gradient(circle,rgba(98,184,98,0.08)_0%,transparent_65%)]" />
        </div>

        <div className="relative z-10 max-w-[1120px] mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Messaging */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 glass-card rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#52b86a] pulse-dot" />
              <span className="text-[10px] font-mono font-bold text-text-tertiary uppercase tracking-widest">
                Live on Devnet
              </span>
            </div>

            <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl leading-[0.9] tracking-tighter mb-5 uppercase text-text-primary">
              The science
              <br />
              journals{" "}
              <span className="relative inline-block">
                <span className="text-neon-cyan">discard</span>
                <span className="absolute left-0 bottom-[0.15em] h-[2px] w-full bg-neon-cyan/30" />
              </span>
            </h1>

            <p className="text-base sm:text-lg text-text-secondary max-w-[480px] mb-8 leading-relaxed">
              NullGraph tokenizes{" "}
              <span className="text-text-primary font-medium">negative research results</span>{" "}
              as on-chain knowledge assets. Publish, verify, and monetize the{" "}
              <span className="font-mono text-neon-cyan font-semibold">95%</span>{" "}
              of science that gets thrown away.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-3 mb-8">
              <Link
                to="/submit"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[#e8e8e8] text-[#060810] text-sm font-mono font-bold uppercase tracking-wider hover:bg-white transition-cyber"
              >
                Submit Null Result <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl glass-card text-sm font-mono font-bold text-text-primary uppercase tracking-wider hover:border-border-hover transition-cyber"
              >
                Browse Registry
              </Link>
            </div>

            {/* Ecosystem badges */}
            <div className="flex items-center gap-4">
              <span className="text-[9px] font-mono font-bold text-text-tertiary uppercase tracking-widest">
                Built on
              </span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface border border-border">
                  <SolanaIcon className="w-3.5 h-3.5 text-text-secondary" />
                  <span className="text-[10px] font-mono font-bold text-text-secondary uppercase tracking-wider">Solana</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface border border-border">
                  <BioIcon className="w-3.5 h-3.5 text-[#62b862]" />
                  <span className="text-[10px] font-mono font-bold text-text-secondary uppercase tracking-wider">Bio Protocol</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Code Block */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Subtle background glow behind the terminal */}
              <div className="absolute -inset-8 bg-[radial-gradient(ellipse_at_center,rgba(94,196,222,0.06)_0%,transparent_70%)] rounded-3xl" />
              <div className="relative">
                <CodeBlock />
                <div className="flex items-center gap-2 mt-3 px-1">
                  <Terminal className="w-3 h-3 text-text-tertiary" />
                  <span className="text-[10px] font-mono text-text-tertiary">
                    Anchor Program — On-chain null result submission
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Strip ──────────────────────────────────────────── */}
      <section className="border-y border-border bg-[#080c14] py-10 px-4">
        <div className="max-w-[1120px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
          <div className="text-center sm:text-left">
            <p className="text-3xl sm:text-4xl font-mono font-bold text-text-primary mb-0.5">95%</p>
            <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-neon-cyan">Results Unpublished</p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-3xl sm:text-4xl font-mono font-bold text-text-primary mb-0.5">$2.4B</p>
            <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-neon-magenta">Wasted Annually</p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-3xl sm:text-4xl font-mono font-bold text-text-primary mb-0.5">100%</p>
            <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-neon-lime">Verifiable On-Chain</p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-3xl sm:text-4xl font-mono font-bold text-text-primary mb-0.5">USDC</p>
            <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-neon-cyan">Bounty Rewards</p>
          </div>
        </div>
      </section>

      {/* ── Problem ──────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-[1120px] mx-auto">
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 items-start">
            {/* Left — heading */}
            <div className="lg:sticky lg:top-28">
              <p className="text-[11px] font-mono font-bold text-neon-magenta uppercase tracking-widest mb-3">
                The Problem
              </p>
              <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight mb-4 text-text-primary">
                Publication bias is destroying science.
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                95% of null results never see the light of day. Researchers repeat failed experiments,
                billions in funding produce results that vanish into filing cabinets, and the
                scientific record remains permanently distorted.
              </p>
            </div>

            {/* Right — cards */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="glass-card glass-card-hover glow-cyan rounded-2xl p-5">
                <FileX2 className="w-5 h-5 text-neon-cyan mb-3" />
                <h3 className="font-display font-black text-sm uppercase tracking-tight mb-1.5 text-text-primary">
                  Publication Bias
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Journals reject negative results, creating a distorted scientific record.
                </p>
              </div>
              <div className="glass-card glass-card-hover glow-magenta rounded-2xl p-5">
                <Eye className="w-5 h-5 text-neon-magenta mb-3" />
                <h3 className="font-display font-black text-sm uppercase tracking-tight mb-1.5 text-text-primary">
                  Wasted Replication
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Researchers repeat failed experiments because failures are never shared.
                </p>
              </div>
              <div className="glass-card glass-card-hover glow-lime rounded-2xl p-5">
                <Coins className="w-5 h-5 text-neon-lime mb-3" />
                <h3 className="font-display font-black text-sm uppercase tracking-tight mb-1.5 text-text-primary">
                  Lost Investment
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Billions in funding produces results that sit forgotten in filing cabinets.
                </p>
              </div>
              <div className="glass-card glass-card-hover glow-cyan rounded-2xl p-5">
                <Lock className="w-5 h-5 text-neon-cyan mb-3" />
                <h3 className="font-display font-black text-sm uppercase tracking-tight mb-1.5 text-text-primary">
                  No Incentive
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Researchers have zero incentive to publish non-discoveries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Solution — 3 Pillars ─────────────────────────────────── */}
      <section className="py-20 px-4 border-y border-border bg-[#080c14]">
        <div className="max-w-[1120px] mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] font-mono font-bold text-neon-lime uppercase tracking-widest mb-3">
              The Solution
            </p>
            <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-text-primary">
              On-Chain Null Knowledge Assets
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="glass-card glass-card-hover glow-cyan rounded-2xl p-7 flex flex-col">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 bg-neon-cyan/8 border border-neon-cyan/15">
                <Database className="w-5 h-5 text-neon-cyan" />
              </div>
              <h3 className="font-display font-black text-sm uppercase tracking-tight mb-2 text-text-primary">
                Tokenize
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed mb-auto">
                Turn null results into permanent, verifiable NKAs on Solana with full metadata.
              </p>
              <div className="flex items-center gap-2 mt-5 pt-4 border-t border-border">
                <CheckCircle className="w-3.5 h-3.5 text-neon-cyan" />
                <span className="text-[10px] font-mono text-text-tertiary">Immutable on-chain record</span>
              </div>
            </div>
            <div className="glass-card glass-card-hover glow-magenta rounded-2xl p-7 flex flex-col">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 bg-neon-magenta/8 border border-neon-magenta/15">
                <Shield className="w-5 h-5 text-neon-magenta" />
              </div>
              <h3 className="font-display font-black text-sm uppercase tracking-tight mb-2 text-text-primary">
                Verify
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed mb-auto">
                Community-driven verification builds trust in negative findings.
              </p>
              <div className="flex items-center gap-2 mt-5 pt-4 border-t border-border">
                <CheckCircle className="w-3.5 h-3.5 text-neon-magenta" />
                <span className="text-[10px] font-mono text-text-tertiary">Peer attestation system</span>
              </div>
            </div>
            <div className="glass-card glass-card-hover glow-lime rounded-2xl p-7 flex flex-col">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 bg-neon-lime/8 border border-neon-lime/15">
                <DollarSign className="w-5 h-5 text-neon-lime" />
              </div>
              <h3 className="font-display font-black text-sm uppercase tracking-tight mb-2 text-text-primary">
                Monetize
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed mb-auto">
                Bounty marketplace lets BioDAOs pay for the null results they need.
              </p>
              <div className="flex items-center gap-2 mt-5 pt-4 border-t border-border">
                <CheckCircle className="w-3.5 h-3.5 text-neon-lime" />
                <span className="text-[10px] font-mono text-text-tertiary">USDC-denominated rewards</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works — Timeline ──────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-[1120px] mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] font-mono font-bold text-neon-cyan uppercase tracking-widest mb-3">
              How It Works
            </p>
            <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-text-primary">
              5 steps. Experiment to asset.
            </h2>
          </div>

          {/* Desktop: horizontal steps connected by a line */}
          <div className="relative">
            {/* Connection line */}
            <div className="hidden sm:block absolute top-[2.25rem] left-[10%] right-[10%] h-px bg-border" />

            <div className="grid sm:grid-cols-5 gap-4">
              {[
                { step: "01", icon: FlaskConical, title: "Experiment", desc: "Run your experiment and observe a null result." },
                { step: "02", icon: Layers, title: "Submit", desc: "Fill a 4-step form to mint your NKA on-chain." },
                { step: "03", icon: Search, title: "Browse", desc: "Anyone can search the registry of published results." },
                { step: "04", icon: Zap, title: "Bounty", desc: "BioDAOs post bounties for specific null results." },
                { step: "05", icon: CheckCircle, title: "Earn", desc: "Link your NKA to a bounty and earn USDC." },
              ].map((item) => (
                <div key={item.step} className="glass-card glass-card-hover rounded-2xl p-5 text-center relative">
                  <div className="w-8 h-8 rounded-full glass-card flex items-center justify-center mx-auto mb-3 border border-border">
                    <span className="text-[10px] font-mono font-bold text-neon-cyan tracking-widest">{item.step}</span>
                  </div>
                  <item.icon className="w-4 h-4 text-text-tertiary mx-auto mb-2" />
                  <h3 className="font-display font-black text-xs uppercase tracking-tight mb-1 text-text-primary">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-text-tertiary leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Code Block — mobile (shown below hero on small screens) */}
      <section className="lg:hidden px-4 pb-16">
        <div className="max-w-[1120px] mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="w-3.5 h-3.5 text-text-tertiary" />
            <span className="text-[10px] font-mono font-bold text-text-tertiary uppercase tracking-widest">
              Anchor Program Preview
            </span>
          </div>
          <CodeBlock />
        </div>
      </section>


      {/* ── CTA — Multi-audience ─────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-[1120px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-text-primary mb-3">
              Get Started
            </h2>
            <p className="text-sm text-text-secondary max-w-md mx-auto">
              Whether you're a researcher, a BioDAO, or just curious — there's a place for you.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="glass-card glass-card-hover glow-cyan rounded-2xl p-7 text-center">
              <p className="text-[10px] font-mono font-bold text-neon-cyan uppercase tracking-widest mb-3">
                Researchers
              </p>
              <h3 className="font-display font-black text-base uppercase tracking-tight mb-2 text-text-primary">
                Publish null results
              </h3>
              <p className="text-xs text-text-secondary mb-5 leading-relaxed">
                Turn negative findings into permanent on-chain knowledge assets.
              </p>
              <Link
                to="/submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-cyber border border-neon-cyan/25 text-neon-cyan hover:bg-neon-cyan/8 hover:border-neon-cyan/40"
              >
                Submit NKA <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="glass-card glass-card-hover glow-magenta rounded-2xl p-7 text-center">
              <p className="text-[10px] font-mono font-bold text-neon-magenta uppercase tracking-widest mb-3">
                BioDAOs
              </p>
              <h3 className="font-display font-black text-base uppercase tracking-tight mb-2 text-text-primary">
                Fund open science
              </h3>
              <p className="text-xs text-text-secondary mb-5 leading-relaxed">
                Post bounties for specific null results and fund real research.
              </p>
              <Link
                to="/market"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-cyber border border-neon-magenta/25 text-neon-magenta hover:bg-neon-magenta/8 hover:border-neon-magenta/40"
              >
                Create Bounty <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="glass-card glass-card-hover glow-lime rounded-2xl p-7 text-center">
              <p className="text-[10px] font-mono font-bold text-neon-lime uppercase tracking-widest mb-3">
                Everyone
              </p>
              <h3 className="font-display font-black text-base uppercase tracking-tight mb-2 text-text-primary">
                Explore the registry
              </h3>
              <p className="text-xs text-text-secondary mb-5 leading-relaxed">
                The world's first open database of verified null results.
              </p>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-cyber border border-neon-lime/25 text-neon-lime hover:bg-neon-lime/8 hover:border-neon-lime/40"
              >
                View Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
