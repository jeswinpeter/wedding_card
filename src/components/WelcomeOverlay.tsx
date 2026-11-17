import React, { useState, useEffect } from "react";
import { Music, Sparkles } from "lucide-react";

interface WelcomeOverlayProps {
  onEnter: (playMusic: boolean) => void;
}

// Classical South Indian Corner Filigree (Konakalasam / Temple Brass Carving)
const TempleCornerOrnament: React.FC<{
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}> = ({ position }) => {
  const getTransform = () => {
    switch (position) {
      case "top-left":
        return "";
      case "top-right":
        return "scale(-1, 1)";
      case "bottom-left":
        return "scale(1, -1)";
      case "bottom-right":
        return "scale(-1, -1)";
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case "top-left":
        return "top-3 left-3 sm:top-5 sm:left-5";
      case "top-right":
        return "top-3 right-3 sm:top-5 sm:right-5";
      case "bottom-left":
        return "bottom-3 left-3 sm:bottom-5 sm:left-5";
      case "bottom-right":
        return "bottom-3 right-3 sm:bottom-5 sm:right-5";
    }
  };

  return (
    <div
      className={`absolute ${getPositionClasses()} w-14 h-14 sm:w-20 sm:h-20 pointer-events-none select-none z-10 opacity-85`}
      style={{ transform: getTransform() }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Outer stepped temple border brackets */}
        <path
          d="M 6 46 L 6 6 L 46 6"
          stroke="#5e3713"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 12 40 L 12 12 L 40 12"
          stroke="#8f5b24"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M 16 32 L 16 16 L 32 16"
          stroke="#b8860b"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeDasharray="2 3"
        />

        {/* Auspicious corner pearl / bindu */}
        <circle cx="12" cy="12" r="3" fill="#4d2c0e" stroke="#d4af37" strokeWidth="0.8" />

        {/* Classical temple floral creeper (Vallikkettu) flourish */}
        <path
          d="M 12 12 C 24 16, 32 24, 38 42 C 40 48, 48 48, 50 42 C 54 28, 42 16, 26 12"
          stroke="#5e3713"
          strokeWidth="1.5"
          fill="#8f5b24"
          fillOpacity="0.12"
          strokeLinecap="round"
        />
        <path
          d="M 12 12 C 16 24, 24 32, 42 38 C 48 40, 48 48, 42 50 C 28 54, 16 42, 12 26"
          stroke="#5e3713"
          strokeWidth="1.5"
          fill="#8f5b24"
          fillOpacity="0.12"
          strokeLinecap="round"
        />

        {/* Radiating central lotus bud finial */}
        <path
          d="M 14 14 Q 36 36 58 58"
          stroke="#78481c"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeDasharray="1 3"
        />
        <path
          d="M 44 44 C 48 40, 56 42, 60 50 C 64 58, 58 64, 50 60 C 42 56, 40 48, 44 44 Z"
          fill="#8a531d"
          fillOpacity="0.22"
          stroke="#5a310c"
          strokeWidth="1.2"
        />
        <circle cx="52" cy="52" r="2.2" fill="#b8860b" />

        {/* Temple boundary bead dots */}
        <circle cx="24" cy="6" r="1.5" fill="#5e3713" />
        <circle cx="34" cy="6" r="1.5" fill="#5e3713" />
        <circle cx="6" cy="24" r="1.5" fill="#5e3713" />
        <circle cx="6" cy="34" r="1.5" fill="#5e3713" />
      </svg>
    </div>
  );
};

// Traditional South Indian Lotus & Vallikkettu Manuscript Divider
const ManuscriptDivider: React.FC = () => (
  <div className="w-full flex items-center justify-center my-1 select-none pointer-events-none">
    <svg
      viewBox="0 0 320 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-56 sm:w-68 max-w-full h-8"
    >
      {/* Left ruled guidelines */}
      <path d="M 20 18 L 115 18" stroke="#633914" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M 35 14 L 105 14" stroke="#996225" strokeWidth="0.8" strokeDasharray="3 3" />
      <circle cx="16" cy="18" r="2.5" fill="#633914" />
      <circle cx="8" cy="18" r="1.5" fill="#b8860b" />

      {/* Right ruled guidelines */}
      <path d="M 205 18 L 300 18" stroke="#633914" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M 215 14 L 285 14" stroke="#996225" strokeWidth="0.8" strokeDasharray="3 3" />
      <circle cx="304" cy="18" r="2.5" fill="#633914" />
      <circle cx="312" cy="18" r="1.5" fill="#b8860b" />

      {/* Left scroll flourish */}
      <path
        d="M 115 18 C 125 18, 132 12, 138 12 C 144 12, 145 16, 140 18 C 135 20, 130 24, 138 25 C 146 26, 150 20, 153 18"
        stroke="#633914"
        strokeWidth="1.3"
        fill="none"
        strokeLinecap="round"
      />

      {/* Right scroll flourish */}
      <path
        d="M 205 18 C 195 18, 188 12, 182 12 C 176 12, 175 16, 180 18 C 185 20, 190 24, 182 25 C 174 26, 170 20, 167 18"
        stroke="#633914"
        strokeWidth="1.3"
        fill="none"
        strokeLinecap="round"
      />

      {/* Center Sacred Lotus (Padmam) */}
      <ellipse cx="160" cy="18" rx="4.5" ry="5.5" fill="#4d2c0e" stroke="#b8860b" strokeWidth="1" />
      <circle cx="160" cy="18" r="1.5" fill="#f0d57e" />

      {/* Lotus petals */}
      <path d="M 160 11 C 157 6, 163 6, 160 11 Z" fill="#633914" stroke="#996225" strokeWidth="0.8" />
      <path d="M 160 25 C 157 30, 163 30, 160 25 Z" fill="#633914" stroke="#996225" strokeWidth="0.8" />
      <path d="M 153 15 C 147 13, 148 19, 153 18 Z" fill="#78481c" stroke="#996225" strokeWidth="0.8" />
      <path d="M 167 15 C 173 13, 172 19, 167 18 Z" fill="#78481c" stroke="#996225" strokeWidth="0.8" />
      <circle cx="147" cy="18" r="1.5" fill="#8f5b24" />
      <circle cx="173" cy="18" r="1.5" fill="#8f5b24" />
    </svg>
  </div>
);

// Traditional Palm-Leaf Binding Cord Aperture (Granthakattu)
const GranthaCordHole: React.FC<{ side: "left" | "right" }> = ({ side }) => (
  <div
    className={`absolute top-1/2 -translate-y-1/2 ${
      side === "left" ? "left-2 sm:left-4 md:left-7" : "right-2 sm:right-4 md:right-7"
    } z-10 flex flex-col items-center pointer-events-none select-none`}
  >
    <div className="relative w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center">
      {/* Outer oxidized patina ring */}
      <div className="absolute inset-0 rounded-full border border-[#54300f]/60 bg-[#6b421a]/20 shadow-[0_1px_2px_rgba(255,245,220,0.5)]"></div>
      {/* Beveled leaf margin */}
      <div className="absolute inset-1 rounded-full border border-[#3b1f09] bg-gradient-to-br from-[#2a1406] to-[#4e2c0e]"></div>
      {/* Deep cord hole void */}
      <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#0d0502] shadow-[inset_0_2px_4px_rgba(0,0,0,0.95)]"></div>
      {/* Scribed horizontal slit score mark */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 w-2.5 sm:w-3.5 h-px bg-[#422209]/60 ${
          side === "left" ? "left-full" : "right-full"
        }`}
      ></div>
    </div>
    {/* Traditional Malayalam Palm Leaf Folio Number (1 and 2) */}
    <span className="text-[9px] sm:text-[10px] text-[#543010]/75 font-serif-elegant mt-0.5">
      {side === "left" ? "൧" : "൨"}
    </span>
  </div>
);

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
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-5 sm:p-8 transition-all duration-700 touch-none overscroll-none select-none overflow-hidden ${
        fading ? "opacity-0 pointer-events-none scale-105" : "opacity-100"
      }`}
      style={{
        backgroundColor: "#dcb676",
        backgroundImage: `
          radial-gradient(circle at 50% 48%, #f8eed5 0%, #ebd39f 32%, #dcba78 58%, #be924d 80%, #6b4018 94%, #261306 100%)
        `,
        boxShadow: "inset 0 0 100px 25px rgba(35, 17, 6, 0.75), inset 0 0 45px 8px rgba(18, 8, 2, 0.85)",
      }}
    >
      {/* SVG Layer: Palm Leaf Vascular Fibers, Guideline Score Rules, and Border Framing */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Horizontal dried palm-leaf fiber pattern */}
          <pattern
            id="palm-fibers"
            width="240"
            height="6"
            patternUnits="userSpaceOnUse"
          >
            <line x1="0" y1="1" x2="240" y2="1" stroke="#6e4219" strokeWidth="0.4" strokeOpacity="0.14" />
            <line x1="0" y1="3.5" x2="240" y2="3.5" stroke="#fdf5dd" strokeWidth="0.4" strokeOpacity="0.22" />
            <line x1="40" y1="5" x2="180" y2="5" stroke="#543011" strokeWidth="0.3" strokeOpacity="0.12" />
          </pattern>

          {/* Scribe Guideline Pattern: subtle parallel scoring lines as used on Thaliyola */}
          <pattern
            id="manuscript-guidelines"
            width="100"
            height="34"
            patternUnits="userSpaceOnUse"
          >
            <line x1="0" y1="33" x2="100" y2="33" stroke="#663c16" strokeWidth="0.5" strokeOpacity="0.08" />
          </pattern>

          {/* Organic paper/leaf micro-aging filter */}
          <filter id="parchment-aging" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.025 0.2" numOctaves="4" result="noise" />
            <feColorMatrix
              type="matrix"
              values="0.3 0 0 0 0.15  0 0.25 0 0 0.1  0 0 0.18 0 0.05  0 0 0 0.25 0"
              result="tinted"
            />
            <feBlend mode="multiply" in="SourceGraphic" in2="tinted" />
          </filter>
        </defs>

        {/* Full-bleed vascular fiber fill */}
        <rect width="100%" height="100%" fill="url(#palm-fibers)" />
        <rect width="100%" height="100%" fill="url(#manuscript-guidelines)" />

        {/* Natural palm leaf frond horizontal color band variation */}
        <rect y="18%" width="100%" height="12%" fill="#523010" fillOpacity="0.03" />
        <rect y="44%" width="100%" height="14%" fill="#fff" fillOpacity="0.03" />
        <rect y="70%" width="100%" height="12%" fill="#523010" fillOpacity="0.04" />
      </svg>

      {/* Traditional Double Margin Rule Borders */}
      <div className="absolute inset-3 sm:inset-5 md:inset-7 border-2 border-[#5e3814]/50 pointer-events-none z-0 rounded-sm"></div>
      <div className="absolute inset-4 sm:inset-6 md:inset-8 border border-[#855623]/35 pointer-events-none z-0"></div>

      {/* Four Classical Temple Corner Filigrees */}
      <TempleCornerOrnament position="top-left" />
      <TempleCornerOrnament position="top-right" />
      <TempleCornerOrnament position="bottom-left" />
      <TempleCornerOrnament position="bottom-right" />

      {/* Authentic South Indian Palm Leaf Binding Cord Apertures */}
      <GranthaCordHole side="left" />
      <GranthaCordHole side="right" />

      {/* TOP: Auspicious Header Section */}
      <div className="pt-6 sm:pt-8 text-center space-y-2 z-10 max-w-sm px-2">
        {/* Palm-leaf cartouche plaque */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#70451a]/55 bg-gradient-to-r from-[#deba7a]/60 via-[#f2deae]/85 to-[#deba7a]/60 text-[#2c1608] shadow-[0_1px_3px_rgba(255,245,220,0.6)] backdrop-blur-[1px]">
          <Sparkles className="w-3.5 h-3.5 text-[#85531d] animate-pulse" />
          <span className="text-xs tracking-[0.22em] font-heading font-semibold uppercase">
            Wedding Invitation
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#85531d] animate-pulse" />
        </div>
        <p className="text-xs sm:text-sm text-[#47270e] tracking-widest font-serif-elegant italic drop-shadow-[0_1px_1px_rgba(255,248,230,0.6)]">
          With the blessings of our families
        </p>
      </div>

      {/* CENTER: Sacred Malayalam Title, Auspicious Divider & Couple's Names */}
      <div className="text-center space-y-3.5 max-w-sm px-4 z-10">
        {/* Malayalam Title: "വേളി" - Ancient Manuscript Inscription Style */}
        <div className="relative inline-block py-0.5">
          <h1 className="text-5xl sm:text-6xl font-malayalam text-[#1f0d04] font-bold tracking-wider drop-shadow-[0_1px_1px_rgba(255,245,225,0.85)]">
            വേളി
          </h1>
        </div>

        {/* Classical South Indian Temple Lotus Divider */}
        <ManuscriptDivider />

        {/* Couple's Names */}
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-[#210e05] tracking-wide drop-shadow-[0_1px_1px_rgba(255,248,230,0.7)]">
            Vasudev
          </h2>
          <p className="text-[#a13f19] font-script text-2xl sm:text-3xl -my-1 drop-shadow-[0_1px_1px_rgba(255,245,220,0.5)]">
            &
          </p>
          <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-[#210e05] tracking-wide drop-shadow-[0_1px_1px_rgba(255,248,230,0.7)]">
            Aparna
          </h2>
        </div>

        {/* Ceremony Date & Location */}
        <p className="text-xs sm:text-sm text-[#47270e] font-serif-elegant italic tracking-wide drop-shadow-[0_1px_1px_rgba(255,248,230,0.6)]">
          January 24, 2027 • Sunday • Mukkam
        </p>
      </div>

      {/* BOTTOM: Action Button Styled as Royal Temple Brass Seal */}
      <div className="w-full max-w-xs space-y-3 pb-6 sm:pb-8 text-center z-10">
        <button
          onClick={() => handleOpen(true)}
          className="w-full py-3.5 px-6 rounded-xl relative overflow-hidden transition-all duration-300 transform active:scale-95 hover:scale-[1.02] shadow-[0_8px_25px_rgba(66,35,10,0.45)] group bg-gradient-to-r from-[#9c6e25] via-[#d9b152] to-[#9c6e25] border-2 border-[#fae8bc]/70 text-[#1a0c03]"
        >
          {/* Metallic sheen layer & traditional corner rivets */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-black/15 pointer-events-none"></div>
          <div className="absolute top-1.5 left-2 w-1.5 h-1.5 rounded-full bg-[#472709]/60 shadow-[0_0_1px_rgba(255,255,255,0.5)]"></div>
          <div className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-[#472709]/60 shadow-[0_0_1px_rgba(255,255,255,0.5)]"></div>
          <div className="absolute bottom-1.5 left-2 w-1.5 h-1.5 rounded-full bg-[#472709]/60 shadow-[0_0_1px_rgba(255,255,255,0.5)]"></div>
          <div className="absolute bottom-1.5 right-2 w-1.5 h-1.5 rounded-full bg-[#472709]/60 shadow-[0_0_1px_rgba(255,255,255,0.5)]"></div>

          <div className="relative flex items-center justify-center gap-2.5 font-heading text-base font-bold tracking-wider">
            <Music className="w-5 h-5 text-[#1a0c03] group-hover:scale-110 transition-transform" />
            <span>Open Invitation</span>
          </div>
        </button>

        <p className="text-[10px] sm:text-xs text-[#522f10]/85 pt-1 tracking-wide font-body drop-shadow-[0_1px_1px_rgba(255,248,230,0.5)]">
          Scroll down on screen to unfold the wedding card
        </p>
      </div>
    </div>
  );
};
