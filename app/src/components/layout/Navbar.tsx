import { Link, useLocation } from "react-router-dom";
import { WalletButton } from "../wallet/WalletButton";
import { StatusDot } from "../ui/StatusDot";

const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/submit", label: "Submit" },
  { to: "/market", label: "Market" },
];

export function Navbar() {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display font-extrabold text-lg tracking-tight text-text-primary">
              Null<span className="text-null-amber">Graph</span>
            </span>
            <StatusDot color="green" />
          </Link>

          <div className="hidden sm:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors ${
                    active
                      ? "bg-surface-raised text-text-primary"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-[10px] font-mono text-text-tertiary uppercase tracking-wider">
            Devnet
          </span>
          <WalletButton />
        </div>
      </div>
    </nav>
  );
}
