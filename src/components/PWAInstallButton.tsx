import React, { useState, useEffect } from 'react';
import { usePWAInstall, useOnlineStatus } from '../hooks/usePWAInstall';
import { Download, Share2, X, WifiOff, Smartphone } from 'lucide-react';

export const PWAInstallButton: React.FC<{ variant?: 'navbar' | 'banner' | 'modal' }> = ({
  variant = 'navbar',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running standalone, suppress button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  // If not installable and not iOS, don't show or show subtle badge in banner mode
  if (!isInstallable && !isIOS && variant !== 'banner') {
    return null;
  }

  return (
    <>
      {variant === 'navbar' ? (
        <button
          id="pwa-install-nav-btn"
          onClick={handleInstallClick}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-black transition-all shadow-sm cursor-pointer"
          title="Install Savanna Bites to home screen"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>
      ) : variant === 'banner' ? (
        <div className="flex items-center justify-between gap-3 px-4 py-2 bg-gradient-to-r from-amber-600/20 via-orange-600/20 to-amber-600/20 border-b border-amber-500/20 text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Install Savanna Bites on your phone for faster ordering and offline menu!</span>
          </div>
          <button
            onClick={handleInstallClick}
            className="px-2.5 py-1 bg-amber-500 text-black font-semibold rounded-md hover:bg-amber-400 transition shrink-0 cursor-pointer"
          >
            Install
          </button>
        </div>
      ) : (
        <button
          id="pwa-install-btn"
          onClick={handleInstallClick}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition shadow-md cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Install Savanna Bites App</span>
        </button>
      )}

      {/* iOS Installation Instructions Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-zinc-900 border border-zinc-700 p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-amber-400" />
                Install on iPhone / iPad
              </h3>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm text-zinc-300">
              <p className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs shrink-0">
                  1
                </span>
                <span>
                  Tap the <strong className="text-white">Share</strong> button (box with upward arrow) in Safari’s bottom toolbar.
                </span>
              </p>
              <p className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs shrink-0">
                  2
                </span>
                <span>
                  Scroll down the share sheet and tap <strong className="text-white">Add to Home Screen</strong>.
                </span>
              </p>
              <p className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs shrink-0">
                  3
                </span>
                <span>
                  Tap <strong className="text-white">Add</strong> in top right corner. Launch Savanna Bites directly like a native app!
                </span>
              </p>
            </div>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full rounded-xl bg-amber-500 py-2.5 text-sm font-bold text-black hover:bg-amber-400 transition cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};

/**
 * PWAInstallPopup
 * A small, non-intrusive "Install the App 📱" pop-up on the Home page.
 * Handles browser support gracefully, displays only once per session if dismissed.
 */
export const PWAInstallPopup: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showPopup, setShowPopup] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // If already installed, don't show
    if (isInstalled) {
      setShowPopup(false);
      return;
    }

    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem('savanna_pwa_popup_dismissed');
    if (isDismissed) {
      return;
    }

    // Delay display slightly so initial page render is calm and smooth
    const timer = setTimeout(() => {
      // Show if installable prompt is ready or on iOS Safari
      if (isInstallable || isIOS) {
        setShowPopup(true);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [isInstallable, isInstalled, isIOS]);

  const handleDismiss = () => {
    sessionStorage.setItem('savanna_pwa_popup_dismissed', 'true');
    setShowPopup(false);
  };

  const handleInstall = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setShowPopup(false);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  if (!showPopup || isInstalled) {
    return (
      <>
        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-zinc-900 border border-zinc-700 p-6 shadow-2xl text-white">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-amber-400" />
                  Install on iPhone / iPad
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-full text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 space-y-3 text-sm text-zinc-300">
                <p className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs shrink-0">
                    1
                  </span>
                  <span>
                    Tap the <strong className="text-white">Share</strong> button in Safari’s bottom toolbar.
                  </span>
                </p>
                <p className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs shrink-0">
                    2
                  </span>
                  <span>
                    Select <strong className="text-white">Add to Home Screen</strong>.
                  </span>
                </p>
                <p className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs shrink-0">
                    3
                  </span>
                  <span>Tap <strong className="text-white">Add</strong> in top right.</span>
                </p>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-amber-500 py-2.5 text-sm font-bold text-black hover:bg-amber-400 transition cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className="fixed bottom-5 left-4 sm:left-6 z-40 max-w-xs sm:max-w-sm rounded-2xl bg-zinc-900/95 border border-amber-500/30 p-4 shadow-2xl backdrop-blur-md animate-fade-in text-stone-200">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-white">Install the App 📱</h4>
                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 text-[9px] font-bold font-mono uppercase">
                  Fast
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                Add Savanna Bites to your home screen for 1-tap food ordering and offline menu access.
              </p>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="text-zinc-500 hover:text-zinc-300 p-1 rounded-md transition cursor-pointer shrink-0"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-zinc-800">
          <button
            onClick={handleInstall}
            className="flex-1 py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition cursor-pointer text-center shadow-sm"
          >
            Install Now
          </button>
          <button
            onClick={handleDismiss}
            className="py-1.5 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-xs font-medium transition cursor-pointer"
          >
            Not now
          </button>
        </div>
      </div>

      {/* iOS Instructions Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-zinc-900 border border-zinc-700 p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-amber-400" />
                Install on iPhone / iPad
              </h3>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm text-zinc-300">
              <p className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs shrink-0">
                  1
                </span>
                <span>
                  Tap the <strong className="text-white">Share</strong> button in Safari’s bottom toolbar.
                </span>
              </p>
              <p className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs shrink-0">
                  2
                </span>
                <span>
                  Select <strong className="text-white">Add to Home Screen</strong>.
                </span>
              </p>
              <p className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs shrink-0">
                  3
                </span>
                <span>Tap <strong className="text-white">Add</strong> in top right.</span>
              </p>
            </div>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full rounded-xl bg-amber-500 py-2.5 text-sm font-bold text-black hover:bg-amber-400 transition cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 left-4 z-40 flex items-center gap-2 rounded-xl bg-red-950/90 border border-red-700/60 px-3.5 py-2 text-xs font-semibold text-red-200 shadow-xl backdrop-blur-xs">
      <WifiOff className="w-4 h-4 text-red-400 animate-pulse" />
      <span>Offline Mode — Browsing cached menu</span>
    </div>
  );
};
