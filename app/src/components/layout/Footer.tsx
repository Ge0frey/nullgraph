export function Footer() {
  return (
    <footer className="border-t border-border py-8 mt-16">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-sm text-text-secondary">
            Null<span className="text-null-amber">Graph</span>
          </span>
          <span className="text-[10px] font-mono text-text-tertiary">
            v0.1.0
          </span>
        </div>
        <p className="text-xs font-mono text-text-tertiary">
          Built for Solana Graveyard Hackathon x Bio Protocol
        </p>
      </div>
    </footer>
  );
}
