import React, { useEffect, useRef, useState, useCallback } from "react";
import confetti from "canvas-confetti";
import { ChevronDown } from "lucide-react";

interface WeddingCardCanvasProps {
  onProgressChange?: (progress: number) => void;
  onCardUnfolded?: () => void;
  isLocked?: boolean;
}

const TOTAL_FRAMES = 118;

export const WeddingCardCanvas: React.FC<WeddingCardCanvasProps> = ({
  onProgressChange,
  onCardUnfolded,
  isLocked = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Cached images
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  // Smooth lerp frame tracking
  const targetFrameRef = useRef(0);
  const renderedFrameRef = useRef(0);
  const animFrameIdRef = useRef<number | null>(null);

  // Format frame filename
  const getFrameUrl = (index: number) => {
    const frameNum = (index + 1).toString().padStart(3, "0");
    return `/frames/ezgif-frame-${frameNum}.jpg`;
  };

  // Preload initial and subsequent frames
  useEffect(() => {
    let isCancelled = false;

    // Load frame 1 immediately
    const firstImg = new Image();
    firstImg.src = getFrameUrl(0);
    firstImg.onload = () => {
      if (isCancelled) return;
      imagesRef.current[0] = firstImg;
      drawFrame(0);

      // Preload the rest progressively
      for (let i = 1; i < TOTAL_FRAMES; i++) {
        const img = new Image();
        img.src = getFrameUrl(i);
        img.onload = () => {
          if (isCancelled) return;
          imagesRef.current[i] = img;
        };
      }
    };

    return () => {
      isCancelled = true;
    };
  }, []);

  // Draw frame on canvas with high DPI and mobile-first framing
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[frameIndex] || imagesRef.current[0];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, displayWidth, displayHeight);

    // Fill deep wedding textured background
    ctx.fillStyle = "#1a0f0a";
    ctx.fillRect(0, 0, displayWidth, displayHeight);

    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    const isPortraitMobile = displayWidth < displayHeight;

    let scale: number;
    let offsetX: number;
    let offsetY: number;

    if (isPortraitMobile) {
      // In mobile portrait, the central invitation card is ~720px wide in the 1920x1080 image.
      // Scaling by displayWidth / 720 ensures the card text, bride/groom hands, and motifs
      // fit the mobile screen width with natural breathing room, without cutting off any text.
      const targetCardWidthInSource = 720;
      scale = displayWidth / targetCardWidthInSource;

      // Don't let height exceed viewport
      if (imgHeight * scale > displayHeight * 0.98) {
        scale = (displayHeight * 0.98) / imgHeight;
      }

      const drawWidth = imgWidth * scale;
      const drawHeight = imgHeight * scale;

      // Center horizontally on the card center (x ≈ 960 in original)
      offsetX = displayWidth / 2 - 960 * scale;
      offsetY = (displayHeight - drawHeight) / 2;

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    } else {
      // Desktop / Landscape: fit to screen gracefully
      const scaleX = displayWidth / imgWidth;
      const scaleY = displayHeight / imgHeight;
      scale = Math.min(scaleX, scaleY);

      const drawWidth = imgWidth * scale;
      const drawHeight = imgHeight * scale;
      offsetX = (displayWidth - drawWidth) / 2;
      offsetY = (displayHeight - drawHeight) / 2;

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }

    // Gentle edge vignette for an organic card feel
    const gradient = ctx.createRadialGradient(
      displayWidth / 2,
      displayHeight / 2,
      Math.min(displayWidth, displayHeight) * 0.42,
      displayWidth / 2,
      displayHeight / 2,
      Math.max(displayWidth, displayHeight) * 0.72
    );
    gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
    gradient.addColorStop(1, "rgba(22, 11, 6, 0.45)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, displayWidth, displayHeight);

    ctx.restore();
  }, []);

  // Smooth animation loop using lerp
  useEffect(() => {
    const loop = () => {
      const diff = targetFrameRef.current - renderedFrameRef.current;
      if (Math.abs(diff) > 0.05) {
        renderedFrameRef.current += diff * 0.28;
        const frameToDraw = Math.round(renderedFrameRef.current);
        const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, frameToDraw));
        drawFrame(clamped);
      }
      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [drawFrame]);

  // Festive golden & marigold petal celebration
  const triggerPetalCelebration = () => {
    const colors = ["#FFD700", "#FFA500", "#FF6347", "#FFE4B5", "#F4C430"];
    confetti({
      particleCount: 45,
      spread: 70,
      origin: { y: 0.55 },
      colors,
      scalar: 1.1,
      ticks: 200,
    });
  };

  // Keep pinned at frame 0 whenever locked
  useEffect(() => {
    if (isLocked) {
      setScrollProgress(0);
      targetFrameRef.current = 0;
      renderedFrameRef.current = 0;
      drawFrame(0);
    }
  }, [isLocked, drawFrame]);

  // Pure scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (isLocked) {
        setScrollProgress(0);
        targetFrameRef.current = 0;
        return;
      }
      if (!containerRef.current) return;
      const scrollY = window.scrollY;
      const containerHeight = containerRef.current.offsetHeight;
      const scrollTrack = containerHeight - window.innerHeight;
      if (scrollTrack <= 0) return;

      const progress = Math.max(0, Math.min(1, scrollY / scrollTrack));
      setScrollProgress(progress);

      const targetFrame = Math.floor(progress * (TOTAL_FRAMES - 1));
      targetFrameRef.current = targetFrame;

      onProgressChange?.(progress);

      // Trigger flower celebration once when card unfolds
      if (progress > 0.9 && !hasCelebrated) {
        setHasCelebrated(true);
        triggerPetalCelebration();
        onCardUnfolded?.();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [onProgressChange, onCardUnfolded, hasCelebrated, isLocked]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      drawFrame(Math.round(renderedFrameRef.current));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawFrame]);

  const scrollToDetails = () => {
    const detailsElem = document.getElementById("invitation-details");
    if (detailsElem) {
      detailsElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-[220vh] bg-[#1a0f0a]">
      {/* Sticky Canvas Container that pins the animation during scroll */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex flex-col justify-between">
        {/* The HTML5 Canvas: pointer-events-none ensures 100% natural touch scrolling on mobile */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Top subtle monogram badge */}
        <div className="relative z-20 flex items-center justify-between p-4 pt-5 pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/25 bg-stone-950/60 backdrop-blur-md shadow-md">
            <span className="text-xs font-heading font-bold text-amber-300/90">
              V & A
            </span>
            <span className="text-[10px] text-stone-500">|</span>
            <span className="text-[10px] font-serif text-amber-200/90">
              വേളി
            </span>
          </div>
        </div>

        {/* Simple down arrow at the bottom with slightly lower opacity */}
        {scrollProgress < 0.08 && (
          <div className="absolute bottom-6 inset-x-0 flex flex-col items-center pointer-events-none transition-opacity duration-700 opacity-45">
            <ChevronDown className="w-7 h-7 text-amber-200 animate-bounce" />
          </div>
        )}

        {/* When invitation has unfolded, show subtle hint to continue to details */}
        {scrollProgress > 0.85 && (
          <div className="absolute bottom-6 inset-x-0 flex flex-col items-center z-20">
            <button
              onClick={scrollToDetails}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-500/30 bg-stone-950/80 backdrop-blur-md text-amber-300 text-xs tracking-wider opacity-70 hover:opacity-100 transition-all duration-300 animate-bounce"
            >
              <span>Ceremony Details</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
