import React, { useState, useEffect } from "react";
import { Music, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeOverlayProps {
  onEnter: (playMusic: boolean) => void;
}

export const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({ onEnter }) => {
  const [fading, setFading] = useState(false);

  // Lock all scrolling while the welcome overlay is active
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyTouchAction = document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    const preventScroll = (e: TouchEvent | WheelEvent) => {
      e.preventDefault();
    };

    const preventKeyScroll = (e: KeyboardEvent) => {
      if (
        ["Space", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"].includes(e.code)
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", preventKeyScroll, { passive: false });

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.touchAction = originalBodyTouchAction;
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventKeyScroll);
    };
  }, []);

  const handleOpen = (playMusic: boolean) => {
    setFading(true);
    setTimeout(() => {
      window.scrollTo(0, 0);
      onEnter(playMusic);
    }, 600);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-gradient-to-b from-[#180d08] via-[#24130b] to-[#120804] text-amber-50 transition-all duration-700 touch-none overscroll-none select-none overflow-hidden ${
        fading ? "opacity-0 pointer-events-none scale-105" : "opacity-100"
      }`}
    >
      {/* Traditional decorative corner borders */}
      <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-500/40 pointer-events-none"></div>
      <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-500/40 pointer-events-none"></div>
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-500/40 pointer-events-none"></div>
      <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-500/40 pointer-events-none"></div>

      {/* Top auspicious header */}
      <div className="pt-8 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-950/40 text-amber-300 text-xs tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Wedding Invitation</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        </div>
        <p className="text-xs text-amber-200/70 tracking-widest font-serif-elegant italic">
          With the blessings of our families
        </p>
      </div>

      {/* Center typography and couples name */}
      <div className="text-center space-y-4 max-w-sm px-4">
        {/* Malayalam Title */}
        <div className="relative inline-block">
          <h1 className="text-5xl sm:text-6xl font-serif text-amber-200/90 font-bold tracking-wider drop-shadow-md">
            വേളി
          </h1>
          
        </div>

        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto"></div>

        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-amber-100 tracking-wide">
            Vasudev
          </h2>
          <p className="text-amber-400 font-script text-2xl -my-1">&</p>
          <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-amber-100 tracking-wide">
            Aparna
          </h2>
        </div>

        <p className="text-xs text-stone-300 font-serif-elegant italic">
          January 24, 2027 • Sunday • Mukkam
        </p>
      </div>

      {/* Action buttons */}
      <div className="w-full max-w-xs space-y-3 pb-8 text-center">
        <Button
          onClick={() => handleOpen(true)}
          variant="gold"
          size="lg"
          className="w-full py-6 text-base tracking-wide rounded-xl shadow-2xl flex items-center justify-center gap-2.5 font-heading group"
        >
          <Music className="w-5 h-5 text-stone-950 group-hover:scale-110 transition-transform" />
          <span>Open Invitation</span>
        </Button>

        {/* <button
          onClick={() => handleOpen(false)}
          className="text-xs text-amber-300/70 hover:text-amber-200 underline underline-offset-4 transition-colors"
        >
          Enter silently
        </button> */}

        <p className="text-[10px] text-amber-200/50 pt-2 tracking-wide">
          Scroll down on screen to unfold the wedding card
        </p>
      </div>
    </div>
  );
};
