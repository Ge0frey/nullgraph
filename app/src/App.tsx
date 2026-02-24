import { useMemo } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { ProgramProvider } from "./context/ProgramContext";
import { ToastProvider } from "./components/ui/Toast";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { NoiseOverlay } from "./components/layout/NoiseOverlay";
import { Scanline } from "./components/layout/Scanline";

import { Landing } from "./pages/Landing";
import { Dashboard } from "./pages/Dashboard";
import { Submit } from "./pages/Submit";
import { Market } from "./pages/Market";
import { BountyDetail } from "./pages/BountyDetail";
import { NullResultDetail } from "./pages/NullResultDetail";

import { RPC_URL } from "./lib/constants";

import "@solana/wallet-adapter-react-ui/styles.css";

function App() {
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={RPC_URL}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <ProgramProvider>
            <ToastProvider>
              <BrowserRouter>
                <div className="min-h-screen bg-background bg-grid text-text-secondary">
                  <NoiseOverlay />
                  <Scanline />
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/submit" element={<Submit />} />
                    <Route path="/market" element={<Market />} />
                    <Route path="/market/:bountyId" element={<BountyDetail />} />
                    <Route path="/nka/:specimenNumber" element={<NullResultDetail />} />
                  </Routes>
                  <Footer />
                </div>
              </BrowserRouter>
            </ToastProvider>
          </ProgramProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
