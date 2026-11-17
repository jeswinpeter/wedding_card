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

  // Inactivity auto-scroll tracking refs
  const timer8sRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timer30sRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAutoScrollingRef = useRef(false);
  const scrollAnimRef = useRef<number | null>(null);
  const hasVisitedDetailsRef = useRef(false);
  const isCardRevealedRef = useRef(false);

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

  // Cancel any active auto-scroll animation
  const cancelAutoScroll = useCallback(() => {
    if (isAutoScrollingRef.current) {
      isAutoScrollingRef.current = false;
      if (scrollAnimRef.current) {
        cancelAnimationFrame(scrollAnimRef.current);
        scrollAnimRef.current = null;
      }
    }
  }, []);

  // Clear all pending inactivity timers
  const clearTimers = useCallback(() => {
    if (timer8sRef.current) {
      clearTimeout(timer8sRef.current);
      timer8sRef.current = null;
    }
    if (timer30sRef.current) {
      clearTimeout(timer30sRef.current);
      timer30sRef.current = null;
    }
  }, []);

  // Custom smooth easing scroll function
  const animateScrollTo = useCallback(
    (targetY: number, duration: number, onComplete?: () => void) => {
      cancelAutoScroll();

      const startY = window.scrollY;
      const distance = targetY - startY;
      if (Math.abs(distance) < 5) {
        onComplete?.();
        return;
      }

      const startTime = performance.now();
      isAutoScrollingRef.current = true;

      const easeInOutCubic = (t: number) => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      const step = (currentTime: number) => {
        if (!isAutoScrollingRef.current) return;

        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeInOutCubic(progress);

        window.scrollTo(0, startY + distance * ease);

        if (progress < 1) {
          scrollAnimRef.current = requestAnimationFrame(step);
        } else {
          isAutoScrollingRef.current = false;
          scrollAnimRef.current = null;
          onComplete?.();
        }
      };

      scrollAnimRef.current = requestAnimationFrame(step);
    },
    [cancelAutoScroll]
  );

  // 30s timer: after card reveal, if not scrolled to details for 30s, scroll slowly to details
  const start30sTimer = useCallback(() => {
    if (timer30sRef.current) clearTimeout(timer30sRef.current);
    if (hasVisitedDetailsRef.current || isLocked) return;

    timer30sRef.current = setTimeout(() => {
      if (hasVisitedDetailsRef.current || isLocked) return;

      const detailsElem = document.getElementById("invitation-details");
      const targetY = detailsElem
        ? detailsElem.getBoundingClientRect().top + window.scrollY
        : (containerRef.current ? containerRef.current.offsetTop + containerRef.current.offsetHeight : window.scrollY + window.innerHeight);

      if (window.scrollY >= targetY - 40) {
        hasVisitedDetailsRef.current = true;
        return;
      }

      // Scroll slowly to the details page (~2600ms)
      animateScrollTo(targetY, 2600, () => {
        hasVisitedDetailsRef.current = true;
      });
    }, 10000);
  }, [isLocked, animateScrollTo]);

  // 8s timer: if card page has not been scrolled for 8s, smoothly reveal the final card
  const start8sTimer = useCallback(() => {
    if (timer8sRef.current) clearTimeout(timer8sRef.current);
    if (isCardRevealedRef.current || isLocked) return;

    timer8sRef.current = setTimeout(() => {
      if (isCardRevealedRef.current || isLocked || !containerRef.current) return;

      const scrollTrack = containerRef.current.offsetHeight - window.innerHeight;
      if (scrollTrack <= 0) return;

      if (window.scrollY >= scrollTrack - 20) {
        isCardRevealedRef.current = true;
        start30sTimer();
        return;
      }

      // Smoothly scroll to reveal final card (~2800ms)
      animateScrollTo(scrollTrack, 2800, () => {
        isCardRevealedRef.current = true;
        start30sTimer();
      });
    }, 4000);
  }, [isLocked, animateScrollTo, start30sTimer]);

  // Handle lock state and trigger 8s timer when wedding card page opens
  useEffect(() => {
    if (isLocked) {
      clearTimers();
      cancelAutoScroll();
      setScrollProgress(0);
      targetFrameRef.current = 0;
      renderedFrameRef.current = 0;
      drawFrame(0);
      isCardRevealedRef.current = false;
      hasVisitedDetailsRef.current = false;
    } else {
      // Card page became active: begin 8s inactivity countdown
      start8sTimer();
    }

    return () => {
      clearTimers();
      cancelAutoScroll();
    };
  }, [isLocked, clearTimers, cancelAutoScroll, drawFrame, start8sTimer]);

  // Cancel auto-scroll immediately if the user touches, wheels, or presses keys
  useEffect(() => {
    const handleUserInteraction = () => {
      cancelAutoScroll();
    };

    window.addEventListener("wheel", handleUserInteraction, { passive: true });
    window.addEventListener("touchstart", handleUserInteraction, { passive: true });
    window.addEventListener("pointerdown", handleUserInteraction, { passive: true });
    window.addEventListener("keydown", handleUserInteraction, { passive: true });

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAutoScroll();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("wheel", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
      window.removeEventListener("pointerdown", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [cancelAutoScroll]);

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

      // Manage inactivity timers when user scrolls manually
      if (!isAutoScrollingRef.current) {
        if (scrollY >= scrollTrack + 80) {
          // User scrolled down into details section
          hasVisitedDetailsRef.current = true;
          isCardRevealedRef.current = true;
          clearTimers();
        } else if (progress >= 0.95) {
          // Final card is reached
          isCardRevealedRef.current = true;
          if (timer8sRef.current) {
            clearTimeout(timer8sRef.current);
            timer8sRef.current = null;
          }
          if (!hasVisitedDetailsRef.current) {
            start30sTimer();
          }
        } else {
          // User scrolled but hasn't reached final card: reset 8s timer
          isCardRevealedRef.current = false;
          if (timer30sRef.current) {
            clearTimeout(timer30sRef.current);
            timer30sRef.current = null;
          }
          start8sTimer();
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [onProgressChange, onCardUnfolded, hasCelebrated, isLocked, clearTimers, start8sTimer, start30sTimer]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      drawFrame(Math.round(renderedFrameRef.current));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawFrame]);

  const scrollToDetails = () => {
    clearTimers();
    cancelAutoScroll();
    hasVisitedDetailsRef.current = true;
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
