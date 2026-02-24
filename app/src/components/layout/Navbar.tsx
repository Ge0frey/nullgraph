import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { WalletButton } from "../wallet/WalletButton";
import { StatusDot } from "../ui/StatusDot";
import { Shield } from "lucide-react";

const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/submit", label: "Submit" },
  { to: "/market", label: "Market" },
];

export function Navbar() {
  const location = useLocation();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent">
        <div
          className="h-full scroll-progress transition-[width] duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-[1120px]">
        <div className="glass-card rounded-2xl px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
                <Shield className="w-4 h-4 text-[#050505]" />
              </div>
              <span className="font-display font-black text-base tracking-tight text-text-primary uppercase">
                Null<span className="text-neon-cyan">Graph</span>
              </span>
            </Link>

            <div className="hidden sm:flex items-center">
              <div className="flex items-center gap-0.5 glass-card rounded-full px-1 py-1">
                {NAV_LINKS.map((link) => {
                  const active = location.pathname === link.to;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest transition-cyber ${
                        active
                          ? "bg-white/10 text-text-primary"
                          : "text-text-tertiary hover:text-text-secondary"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <StatusDot color="green" />
              <span className="text-[10px] font-mono font-bold text-text-tertiary uppercase tracking-widest">
                System Active
              </span>
            </div>
            <WalletButton />
          </div>
        </div>
      </nav>
    </>
  );
}
