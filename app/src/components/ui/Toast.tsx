import { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
  txHash?: string;
}

interface ToastContextState {
  toast: (type: ToastType, message: string, txHash?: string) => void;
}

const ToastContext = createContext<ToastContextState>({
  toast: () => {},
});

let toastId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (type: ToastType, message: string, txHash?: string) => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, type, message, txHash }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 6000);
    },
    []
  );

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle className="w-4 h-4 text-neon-lime" />,
    error: <AlertCircle className="w-4 h-4 text-neon-magenta" />,
    info: <Info className="w-4 h-4 text-neon-cyan" />,
  };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="glass-card rounded-xl p-3 flex items-start gap-3 shadow-lg animate-[fadeIn_0.2s_ease-out]"
          >
            <div className="mt-0.5">{icons[t.type]}</div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-mono font-bold text-text-primary uppercase tracking-wider">
                {t.message}
              </p>
              {t.txHash && (
                <a
                  href={`https://explorer.solana.com/tx/${t.txHash}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-mono text-neon-cyan hover:underline mt-1 block truncate"
                >
                  View on Explorer
                </a>
              )}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="p-0.5 hover:bg-white/5 rounded-lg"
            >
              <X className="w-3 h-3 text-text-tertiary" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
