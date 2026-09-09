import React, { useState, useEffect } from 'react';
import { usePWAInstall, useOnlineStatus } from '../hooks/usePWAInstall';
import { Download, Share2, X, WifiOff, Smartphone, ExternalLink, Monitor, CheckCircle2 } from 'lucide-react';

/**
 * Universal PWA Installation Guide Modal
 * Handles:
 * 1. AI Studio embedded iframe preview (requires opening in new tab)
 * 2. iOS Safari (Share -> Add to Home Screen)
 * 3. Android Chrome (Menu -> Install App)
 * 4. Desktop Chrome / Edge (Address bar icon or Menu)
 */
export const PWAInstallGuideModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  isInstallable: boolean;
  onNativeInstall: () => Promise<boolean | void>;
}> = ({ isOpen, onClose, isInstallable, onNativeInstall }) => {
  const [isInIframe, setIsInIframe] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Detect iframe
    try {
      setIsInIframe(window.self !== window.top);
    } catch {
      setIsInIframe(true);
    }

    // Detect device
    const ua = navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));
    setIsAndroid(/android/.test(ua));
  }, []);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-zinc-900 border border-zinc-700 p-6 sm:p-7 shadow-2xl text-stone-200 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-white">
                Install Savanna Bites
              </h3>
              <p className="text-xs text-amber-400/90 font-mono">Good Food. Great Moments.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If native browser prompt is ready, offer 1-click install first */}
        {isInstallable && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>One-Click Installation Ready!</span>
            </div>
            <p className="text-xs text-zinc-300">
              Your browser supports direct installation to your home screen or desktop.
            </p>
            <button
              onClick={async () => {
                await onNativeInstall();
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow-md transition cursor-pointer"
            >
              Click Here to Install Now
            </button>
          </div>
        )}

        {/* If inside iframe (AI Studio preview), show Open in New Tab option */}
        {isInIframe && (
          <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-800/60 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-blue-300">
              <ExternalLink className="w-4 h-4" />
              <span>Preview Window Detected</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              Browsers restrict home-screen installation inside embedded preview frames. Open Savanna Bites in a full window or tab to install directly:
            </p>
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition text-xs"
            >
              <span>Open in Full Tab to Install</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Instructions by Platform */}
        <div className="space-y-3 text-xs text-zinc-300">
          <p className="font-bold text-white uppercase tracking-wider text-[10px] font-mono">
            {isIOS ? 'Instructions for iPhone / iPad (Safari):' : isAndroid ? 'Instructions for Android (Chrome):' : 'Desktop / Laptop Installation:'}
          </p>

          {isIOS ? (
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[11px] shrink-0">
                  1
                </span>
                <span>
                  Tap the <strong className="text-white">Share</strong> button (box with upward arrow <Share2 className="w-3.5 h-3.5 inline mx-0.5 text-amber-400" />) in Safari’s bottom bar.
                </span>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[11px] shrink-0">
                  2
                </span>
                <span>
                  Scroll down the menu and tap <strong className="text-white">Add to Home Screen</strong>.
                </span>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[11px] shrink-0">
                  3
                </span>
                <span>
                  Tap <strong className="text-white">Add</strong> in the top right corner. Savanna Bites is now installed!
                </span>
              </div>
            </div>
          ) : isAndroid ? (
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[11px] shrink-0">
                  1
                </span>
                <span>
                  Tap the <strong className="text-white">three dots (⋮)</strong> menu in the top right corner of Chrome.
                </span>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[11px] shrink-0">
                  2
                </span>
                <span>
                  Select <strong className="text-white">Install App</strong> or <strong className="text-white">Add to Home screen</strong>.
                </span>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[11px] shrink-0">
                  3
                </span>
                <span>
                  Confirm <strong className="text-white">Install</strong>. Launch directly from your phone’s app drawer!
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                <Monitor className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  In <strong className="text-white">Chrome</strong> or <strong className="text-white">Edge</strong>, look for the <strong className="text-white">Install icon (⊕ or ⬇)</strong> on the right side of the address bar.
                </span>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[11px] shrink-0">
                  2
                </span>
                <span>
                  Or click the browser menu <strong className="text-white">(⋮) → 'Install Savanna Bites'</strong>.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-zinc-800 hover:bg-zinc-700 py-2.5 text-xs font-bold text-white transition cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * PWAInstallButton
 * Used in Navbar, Header, Footer, and Drawer
 */
export const PWAInstallButton: React.FC<{
  variant?: 'navbar' | 'banner' | 'modal' | 'link';
  className?: string;
}> = ({ variant = 'navbar', className = '' }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  // If already running standalone, suppress button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const result = await install();
      if (!result) {
        setShowGuide(true);
      }
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      {variant === 'navbar' ? (
        <button
          id="pwa-install-nav-btn"
          onClick={handleInstallClick}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-black transition-all shadow-sm cursor-pointer ${className}`}
          title="Install Savanna Bites app on your device"
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
      ) : variant === 'link' ? (
        <button
          onClick={handleInstallClick}
          className={`inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition text-xs cursor-pointer ${className}`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Install App 📱</span>
        </button>
      ) : (
        <button
          id="pwa-install-btn"
          onClick={handleInstallClick}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition shadow-md cursor-pointer ${className}`}
        >
          <Download className="w-4 h-4" />
          <span>Install Savanna Bites App</span>
        </button>
      )}

      {/* Guide modal if native prompt cannot run directly */}
      <PWAInstallGuideModal
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        isInstallable={isInstallable}
        onNativeInstall={install}
      />
    </>
  );
};

/**
 * PWAInstallPopup
 * The floating "Install the App 📱" pop-up banner on the bottom corner.
 * - Always visible after 1 second unless already in standalone mode or dismissed for this session.
 * - Clicking "Install Now" either invokes native install (if available) or opens the visual guide.
 */
export const PWAInstallPopup: React.FC = () => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [showPopup, setShowPopup] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    // If running in standalone installed app, do not show
    if (isInstalled) {
      setShowPopup(false);
      return;
    }

    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem('savanna_pwa_popup_dismissed');
    if (isDismissed) {
      return;
    }

    // Show popup smoothly after 1 second on screen
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isInstalled]);

  const handleDismiss = () => {
    sessionStorage.setItem('savanna_pwa_popup_dismissed', 'true');
    setShowPopup(false);
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setShowPopup(false);
      } else {
        setShowGuide(true);
      }
    } else {
      setShowGuide(true);
    }
  };

  if (!showPopup || isInstalled) {
    return (
      <PWAInstallGuideModal
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        isInstallable={isInstallable}
        onNativeInstall={install}
      />
    );
  }

  return (
    <>
      <div
        id="pwa-install-popup-card"
        className="fixed bottom-5 left-4 sm:left-6 z-50 max-w-xs sm:max-w-sm rounded-2xl bg-zinc-950/95 border border-amber-500/40 p-4 shadow-2xl backdrop-blur-md text-stone-200 ring-1 ring-amber-500/20 animate-in fade-in slide-in-from-bottom-5 duration-300"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/40 shadow-xs">
              <Smartphone className="w-5 h-5 animate-bounce duration-1000" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-white">Install the App 📱</h4>
                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 text-[9px] font-bold font-mono uppercase">
                  Fast
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                Add Savanna Bites to your home screen for 1-tap food ordering and offline menu access in Ilorin.
              </p>
            </div>
          </div>

          <button
            id="dismiss-pwa-popup-btn"
            onClick={handleDismiss}
            className="text-zinc-500 hover:text-zinc-200 p-1 rounded-lg hover:bg-zinc-800 transition cursor-pointer shrink-0"
            title="Dismiss for this session"
            aria-label="Dismiss popup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-zinc-800">
          <button
            id="pwa-popup-install-now-btn"
            onClick={handleInstallClick}
            className="flex-1 py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition cursor-pointer text-center shadow-md"
          >
            Install Now
          </button>
          <button
            onClick={handleDismiss}
            className="py-1.5 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-medium transition cursor-pointer border border-zinc-800"
          >
            Not now
          </button>
        </div>
      </div>

      {/* Guide modal if browser needs manual step or inside iframe */}
      <PWAInstallGuideModal
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        isInstallable={isInstallable}
        onNativeInstall={install}
      />
    </>
  );
};

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-24 left-4 z-40 flex items-center gap-2 rounded-xl bg-red-950/90 border border-red-700/60 px-3.5 py-2 text-xs font-semibold text-red-200 shadow-xl backdrop-blur-xs">
      <WifiOff className="w-4 h-4 text-red-400 animate-pulse" />
      <span>Offline Mode — Browsing cached menu</span>
    </div>
  );
};
