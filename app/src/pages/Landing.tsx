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
} from "lucide-react";

export function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[90vh] flex items-center justify-center px-4 overflow-hidden">
        {/* Animated radial gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,242,255,0.12)_0%,rgba(255,0,229,0.08)_40%,transparent_70%)]" />

        <div className="relative z-10 max-w-[1120px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 glass-card rounded-full mb-8">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] pulse-dot shadow-[0_0_4px_#22c55e]" />
            <span className="text-[10px] font-mono font-bold text-text-secondary uppercase tracking-widest">
              Solana Graveyard Hackathon x Bio Protocol
            </span>
          </div>

          <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-[10rem] leading-[0.85] tracking-tighter mb-6 uppercase">
            <span className="bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-lime bg-clip-text text-transparent">
              Null
            </span>
            <span className="text-text-primary">Graph</span>
          </h1>

          <p className="font-mono text-lg sm:text-xl text-text-secondary max-w-[600px] mx-auto mb-10">
            Tokenizing the{" "}
            <span className="text-neon-cyan font-bold">95%</span> of science
            that journals throw away. Publish, verify, and monetize{" "}
            <span className="text-neon-magenta font-bold">null results</span>{" "}
            on Solana.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/submit"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-[#050505] text-sm font-mono font-bold uppercase tracking-wider hover:shadow-[0_0_30px_-8px_#ffffff] transition-cyber"
            >
              Submit Null Result <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl glass-card text-sm font-mono font-bold text-text-primary uppercase tracking-wider hover:border-border-hover transition-cyber"
            >
              Browse Registry
            </Link>
          </div>
        </div>

        {/* Floating glass shapes - decorative */}
        <div className="absolute top-1/4 left-[10%] w-32 h-32 glass-card rounded-3xl -rotate-12 opacity-30 hidden lg:block" />
        <div className="absolute bottom-1/4 right-[8%] w-24 h-24 glass-card rounded-2xl rotate-6 opacity-20 hidden lg:block" />
        <div className="absolute top-1/3 right-[15%] w-16 h-16 glass-card rounded-xl rotate-12 opacity-25 hidden lg:block" />
      </section>

      {/* Stats / Social Proof */}
      <section className="border-y border-border bg-black/40 py-12 px-4">
        <div className="max-w-[1120px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-mono font-bold text-text-primary mb-1">95%</p>
            <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-neon-cyan">Results Lost</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-mono font-bold text-text-primary mb-1">$2.4B</p>
            <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-neon-magenta">Wasted Annually</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-mono font-bold text-text-primary mb-1">100%</p>
            <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-neon-lime">On-Chain</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-mono font-bold text-text-primary mb-1">2.5%</p>
            <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-neon-cyan">Protocol Fee</p>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 px-4">
        <div className="max-w-[1120px] mx-auto">
          <p className="text-[11px] font-mono font-bold text-neon-magenta uppercase tracking-widest mb-3">
            The Problem
          </p>
          <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight mb-10 text-text-primary">
            95% of null results never get published.
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="glass-card glass-card-hover glow-cyan rounded-3xl p-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-neon-cyan/10">
                <FileX2 className="w-6 h-6 text-neon-cyan" />
              </div>
              <h3 className="font-display font-black text-sm uppercase tracking-tight mb-2 text-text-primary">
                Publication Bias
              </h3>
              <p className="text-sm text-text-secondary">
                Journals reject negative results, creating a distorted scientific record.
              </p>
            </div>
            <div className="glass-card glass-card-hover glow-magenta rounded-3xl p-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-neon-magenta/10">
                <Eye className="w-6 h-6 text-neon-magenta" />
              </div>
              <h3 className="font-display font-black text-sm uppercase tracking-tight mb-2 text-text-primary">
                Wasted Replication
              </h3>
              <p className="text-sm text-text-secondary">
                Researchers repeat failed experiments because failures aren't shared.
              </p>
            </div>
            <div className="glass-card glass-card-hover glow-lime rounded-3xl p-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-neon-lime/10">
                <Coins className="w-6 h-6 text-neon-lime" />
              </div>
              <h3 className="font-display font-black text-sm uppercase tracking-tight mb-2 text-text-primary">
                Lost Investment
              </h3>
              <p className="text-sm text-text-secondary">
                Billions in research funding produces results that sit in filing cabinets.
              </p>
            </div>
            <div className="glass-card glass-card-hover glow-cyan rounded-3xl p-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-neon-cyan/10">
                <Lock className="w-6 h-6 text-neon-cyan" />
              </div>
              <h3 className="font-display font-black text-sm uppercase tracking-tight mb-2 text-text-primary">
                No Incentive
              </h3>
              <p className="text-sm text-text-secondary">
                Researchers have zero incentive to publish 'non-discoveries'.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20 px-4">
        <div className="max-w-[1120px] mx-auto">
          <p className="text-[11px] font-mono font-bold text-neon-lime uppercase tracking-widest mb-3">
            The Solution
          </p>
          <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight mb-10 text-text-primary">
            On-Chain Null Knowledge Assets
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="glass-card glass-card-hover glow-cyan rounded-3xl p-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-neon-cyan/10">
                <Database className="w-6 h-6 text-neon-cyan" />
              </div>
              <h3 className="font-display font-black text-sm uppercase tracking-tight mb-2 text-text-primary">
                Tokenize
              </h3>
              <p className="text-sm text-text-secondary mb-4">
                Turn null results into on-chain NKAs with permanent, verifiable metadata.
              </p>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-neon-cyan" />
                <span className="text-xs font-mono text-text-tertiary">Permanent on-chain record</span>
              </div>
            </div>
            <div className="glass-card glass-card-hover glow-magenta rounded-3xl p-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-neon-magenta/10">
                <Shield className="w-6 h-6 text-neon-magenta" />
              </div>
              <h3 className="font-display font-black text-sm uppercase tracking-tight mb-2 text-text-primary">
                Verify
              </h3>
              <p className="text-sm text-text-secondary mb-4">
                Community-driven verification builds trust in negative findings.
              </p>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-neon-magenta" />
                <span className="text-xs font-mono text-text-tertiary">Community attestations</span>
              </div>
            </div>
            <div className="glass-card glass-card-hover glow-lime rounded-3xl p-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-neon-lime/10">
                <DollarSign className="w-6 h-6 text-neon-lime" />
              </div>
              <h3 className="font-display font-black text-sm uppercase tracking-tight mb-2 text-text-primary">
                Monetize
              </h3>
              <p className="text-sm text-text-secondary mb-4">
                Bounty marketplace lets BioDAOs pay for the null results they need.
              </p>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-neon-lime" />
                <span className="text-xs font-mono text-text-tertiary">USDC-denominated rewards</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-[1120px] mx-auto">
          <p className="text-[11px] font-mono font-bold text-neon-cyan uppercase tracking-widest mb-3">
            How It Works
          </p>
          <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight mb-10 text-text-primary">
            From failed experiment to valuable asset in 5 steps.
          </h2>
          <div className="grid sm:grid-cols-5 gap-4">
            {[
              { step: "01", icon: FlaskConical, title: "Experiment", desc: "Run your experiment; observe a null result." },
              { step: "02", icon: Layers, title: "Submit", desc: "Fill the 4-step form and mint your NKA on-chain." },
              { step: "03", icon: Search, title: "Browse", desc: "Anyone can browse the registry of published null results." },
              { step: "04", icon: Zap, title: "Bounty", desc: "BioDAOs post bounties for specific null results they need." },
              { step: "05", icon: CheckCircle, title: "Fulfill", desc: "Link your NKA to a bounty and earn USDC." },
            ].map((item) => (
              <div key={item.step} className="glass-card glass-card-hover rounded-2xl p-5 text-center">
                <span className="text-[10px] font-mono font-bold text-neon-cyan tracking-widest">{item.step}</span>
                <item.icon className="w-5 h-5 text-text-secondary mx-auto my-3" />
                <h3 className="font-display font-black text-xs uppercase tracking-tight mb-1 text-text-primary">
                  {item.title}
                </h3>
                <p className="text-[11px] text-text-tertiary">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-12 px-4 border-y border-border bg-black/40">
        <div className="max-w-[1120px] mx-auto text-center">
          <p className="text-[10px] font-mono font-bold text-text-tertiary uppercase tracking-widest mb-4">
            Built With
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] font-mono font-bold text-text-secondary uppercase tracking-widest">
            {["Solana", "Anchor 0.31.1", "SPL Token", "React 19", "Vite 7", "Tailwind v4", "TypeScript"].map(
              (tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 rounded-full glass-card"
                >
                  {tech}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* Multi-audience CTA */}
      <section className="py-20 px-4">
        <div className="max-w-[1120px] mx-auto">
          <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
            <div className="p-8 text-center hover:bg-white/[0.02] transition-cyber">
              <p className="text-[11px] font-mono font-bold text-neon-cyan uppercase tracking-widest mb-3">
                Researchers
              </p>
              <h3 className="font-display font-black text-lg uppercase tracking-tight mb-2 text-text-primary">
                Publish your null results
              </h3>
              <p className="text-sm text-text-secondary mb-5">
                Turn your negative findings into permanent on-chain assets.
              </p>
              <Link
                to="/submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-cyber border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 hover:shadow-[0_0_20px_-8px_#00f2ff]"
              >
                Submit NKA <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="p-8 text-center hover:bg-white/[0.02] transition-cyber">
              <p className="text-[11px] font-mono font-bold text-neon-magenta uppercase tracking-widest mb-3">
                BioDAOs
              </p>
              <h3 className="font-display font-black text-lg uppercase tracking-tight mb-2 text-text-primary">
                Fund the research you need
              </h3>
              <p className="text-sm text-text-secondary mb-5">
                Post bounties for specific null results and fund open science.
              </p>
              <Link
                to="/market"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-cyber border border-neon-magenta/30 text-neon-magenta hover:bg-neon-magenta/10 hover:shadow-[0_0_20px_-8px_#ff00e5]"
              >
                Create Bounty <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="p-8 text-center hover:bg-white/[0.02] transition-cyber">
              <p className="text-[11px] font-mono font-bold text-neon-lime uppercase tracking-widest mb-3">
                Everyone
              </p>
              <h3 className="font-display font-black text-lg uppercase tracking-tight mb-2 text-text-primary">
                Browse the registry
              </h3>
              <p className="text-sm text-text-secondary mb-5">
                Access the world's first open database of verified null results.
              </p>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-cyber border border-neon-lime/30 text-neon-lime hover:bg-neon-lime/10 hover:shadow-[0_0_20px_-8px_#adff00]"
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
