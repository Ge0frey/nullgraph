import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border py-8 mt-16">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded bg-white/10 flex items-center justify-center">
            <Shield className="w-3 h-3 text-neon-cyan" />
          </div>
          <span className="font-display font-black text-sm text-text-secondary uppercase tracking-tight">
            Null<span className="text-neon-cyan">Graph</span>
          </span>
          <span className="text-[10px] font-mono font-bold text-text-tertiary uppercase tracking-widest">
            v0.1.0
          </span>
        </div>
        <p className="text-[10px] font-mono font-bold text-text-tertiary uppercase tracking-widest">
          Built for Solana Graveyard Hackathon x Bio Protocol
        </p>
      </div>
    </footer>
  );
}
