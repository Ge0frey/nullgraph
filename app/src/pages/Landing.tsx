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
    <div className="bg-micro-grid min-h-screen">
      {/* Hero */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-[1120px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface mb-6">
            <span className="w-2 h-2 rounded-full bg-archive-green pulse-dot" />
            <span className="text-[10px] font-mono text-text-secondary uppercase tracking-wider">
              Solana Graveyard Hackathon x Bio Protocol
            </span>
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-4">
            The experiments that{" "}
            <span className="relative inline-block">
              <span className="text-null-amber">"failed"</span>
              <span className="absolute left-0 top-1/2 h-[3px] w-full bg-null-amber/60" />
            </span>
            <br />
            are the ones we need most.
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto mb-8 text-base sm:text-lg">
            NullGraph turns negative scientific results into tokenized knowledge
            assets on Solana. Publish, verify, and monetize the null results that
            95% of science discards.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-archive-green/10 text-archive-green border border-archive-green/30 hover:bg-archive-green/20 text-sm font-mono font-medium transition-all"
            >
              Submit Null Result <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-surface border border-border hover:border-border-hover text-sm font-mono font-medium text-text-primary transition-all"
            >
              Browse Registry
            </Link>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-16 px-4">
        <div className="max-w-[1120px] mx-auto">
          <p className="text-[10px] font-mono text-null-amber uppercase tracking-widest mb-2">
            The Problem
          </p>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl mb-8">
            95% of null results never get published.
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: FileX2, title: "Publication Bias", desc: "Journals reject negative results, creating a distorted scientific record." },
              { icon: Eye, title: "Wasted Replication", desc: "Researchers repeat failed experiments because failures aren't shared." },
              { icon: Coins, title: "Lost Investment", desc: "Billions in research funding produces results that sit in filing cabinets." },
              { icon: Lock, title: "No Incentive", desc: "Researchers have zero incentive to publish 'non-discoveries'." },
            ].map((item) => (
              <div key={item.title} className="bg-surface border border-border rounded-lg p-5">
                <item.icon className="w-5 h-5 text-null-amber mb-3" />
                <h3 className="font-display font-bold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-16 px-4 bg-surface/50">
        <div className="max-w-[1120px] mx-auto">
          <p className="text-[10px] font-mono text-archive-green uppercase tracking-widest mb-2">
            The Solution
          </p>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl mb-8">
            NullGraph: On-Chain Null Knowledge Assets
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Database, title: "Tokenize", desc: "Turn null results into on-chain NKAs with permanent, verifiable metadata." },
              { icon: Shield, title: "Verify", desc: "Community-driven verification builds trust in negative findings." },
              { icon: DollarSign, title: "Monetize", desc: "Bounty marketplace lets BioDAOs pay for the null results they need." },
            ].map((item) => (
              <div key={item.title} className="bg-surface border border-border border-t-2 border-t-archive-green rounded-lg p-5">
                <item.icon className="w-5 h-5 text-archive-green mb-3" />
                <h3 className="font-display font-bold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-[1120px] mx-auto">
          <p className="text-[10px] font-mono text-null-amber uppercase tracking-widest mb-2">
            How It Works
          </p>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl mb-8">
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
              <div key={item.step} className="bg-surface border border-border rounded-lg p-4 text-center">
                <span className="text-[10px] font-mono text-null-amber">{item.step}</span>
                <item.icon className="w-5 h-5 text-text-secondary mx-auto my-2" />
                <h3 className="font-display font-bold text-xs mb-1">{item.title}</h3>
                <p className="text-[11px] text-text-tertiary">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 px-4 bg-surface/50">
        <div className="max-w-[1120px] mx-auto text-center">
          <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest mb-2">
            Built With
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-text-secondary">
            {["Solana", "Anchor 0.31.1", "SPL Token", "React 19", "Vite 7", "Tailwind v4", "TypeScript"].map(
              (tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded border border-border bg-surface"
                >
                  {tech}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-[1120px] mx-auto text-center">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl mb-4">
            Ready to publish your null result?
          </h2>
          <p className="text-text-secondary mb-6 max-w-lg mx-auto">
            Join the movement turning scientific "failures" into the most
            valuable assets in research.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-archive-green/10 text-archive-green border border-archive-green/30 hover:bg-archive-green/20 text-sm font-mono font-medium transition-all"
            >
              Submit Null Result <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/market"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-null-amber/10 text-null-amber border border-null-amber/30 hover:bg-null-amber/20 text-sm font-mono font-medium transition-all"
            >
              Browse Bounties
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
