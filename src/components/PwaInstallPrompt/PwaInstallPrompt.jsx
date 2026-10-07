import { useState, useEffect } from "react";
import { Download, X, Smartphone, Share } from "lucide-react";
import usePwaInstall from "../../hooks/usePwaInstall";

const PwaInstallPrompt = () => {
  const { isInstallable, isInstalled, installApp } = usePwaInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showIosTip, setShowIosTip] = useState(false);

  // Check if device is iOS Safari (which doesn't support beforeinstallprompt)
  const isIOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !window.MSStream;

  useEffect(() => {
    const isDismissed = sessionStorage.getItem("moneymap_pwa_dismissed");
    if (isDismissed) {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("moneymap_pwa_dismissed", "true");
  };

  // If already installed or dismissed, don't show floating banner
  if (isInstalled || dismissed) {
    return null;
  }

  // Only show if browser triggered beforeinstallprompt OR if iOS Safari in browser mode
  if (!isInstallable && !showIosTip) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300 sm:bottom-6 sm:left-auto sm:right-6">
      <div className="flex items-start gap-3.5 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur-md">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-sm border border-blue-100">
          <img
            src="/logo-icon.png"
            alt="MoneyMap"
            className="h-8 w-8 rounded-lg object-contain"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-900">
              Install MoneyMap App
            </h4>
            <button
              type="button"
              onClick={handleDismiss}
              className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Dismiss install prompt"
            >
              <X size={16} />
            </button>
          </div>

          <p className="mt-0.5 text-xs text-slate-500">
            Install on your home screen or desktop for fast, offline-ready finance tracking.
          </p>

          {showIosTip ? (
            <div className="mt-2.5 rounded-lg bg-slate-50 p-2 text-xs text-slate-600 border border-slate-200">
              <span className="font-medium text-slate-800">iOS instructions:</span> Tap the{" "}
              <Share className="inline h-3.5 w-3.5 text-blue-600" /> Share button in Safari, then select{" "}
              <span className="font-semibold text-slate-900">"Add to Home Screen"</span>.
            </div>
          ) : (
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={async () => {
                  if (isIOS) {
                    setShowIosTip(true);
                  } else {
                    const success = await installApp();
                    if (!success && isIOS) {
                      setShowIosTip(true);
                    }
                  }
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              >
                <Download size={13} />
                Install App
              </button>

              <button
                type="button"
                onClick={handleDismiss}
                className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
              >
                Not now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PwaInstallPrompt;
