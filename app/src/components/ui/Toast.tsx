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
    success: <CheckCircle className="w-4 h-4 text-archive-green" />,
    error: <AlertCircle className="w-4 h-4 text-warning-red" />,
    info: <Info className="w-4 h-4 text-info-blue" />,
  };

  const borderColors: Record<ToastType, string> = {
    success: "border-l-archive-green",
    error: "border-l-warning-red",
    info: "border-l-info-blue",
  };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`bg-surface border border-border ${borderColors[t.type]} border-l-2 rounded-md p-3 flex items-start gap-2 shadow-lg animate-[fadeIn_0.2s_ease-out]`}
          >
            {icons[t.type]}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-mono text-text-primary">{t.message}</p>
              {t.txHash && (
                <a
                  href={`https://explorer.solana.com/tx/${t.txHash}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-mono text-info-blue hover:underline mt-0.5 block truncate"
                >
                  View on Explorer
                </a>
              )}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="p-0.5 hover:bg-surface-raised rounded"
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
