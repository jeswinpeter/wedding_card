import React, { useEffect, useRef, useState, useCallback } from "react";
import confetti from "canvas-confetti";
import {
  ChevronDown,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface WeddingCardCanvasProps {
  onProgressChange?: (progress: number) => void;
  onCardUnfolded?: () => void;
}

const TOTAL_FRAMES = 118;

export const WeddingCardCanvas: React.FC<WeddingCardCanvasProps> = ({
  onProgressChange,
  onCardUnfolded,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Cached images
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [fitMode, setFitMode] = useState<"cover" | "contain">("cover");
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

  // Draw frame on canvas with high DPI and responsive aspect ratio
  const drawFrame = useCallback(
    (frameIndex: number) => {
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

      // Calculate source and destination bounds
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;
      const imgAspect = imgWidth / imgHeight;
      const canvasAspect = displayWidth / displayHeight;

      let drawWidth = displayWidth;
      let drawHeight = displayHeight;
      let offsetX = 0;
      let offsetY = 0;

      if (fitMode === "cover") {
        // On mobile portrait, cover ensures the central wedding card fills the screen width/height nicely
        if (canvasAspect > imgAspect) {
          drawWidth = displayWidth;
          drawHeight = displayWidth / imgAspect;
          offsetY = (displayHeight - drawHeight) / 2;
        } else {
          drawHeight = displayHeight;
          drawWidth = displayHeight * imgAspect;
          offsetX = (displayWidth - drawWidth) / 2;
        }
      } else {
        // Contain mode: entire 16:9 card is visible
        if (canvasAspect > imgAspect) {
          drawHeight = displayHeight;
          drawWidth = displayHeight * imgAspect;
          offsetX = (displayWidth - drawWidth) / 2;
        } else {
          drawWidth = displayWidth;
          drawHeight = displayWidth / imgAspect;
          offsetY = (displayHeight - drawHeight) / 2;
        }
      }

      // Fill background texture color
      ctx.fillStyle = "#1a0f0a";
      ctx.fillRect(0, 0, displayWidth, displayHeight);

      // Draw active frame image
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

      // Subtle warm vignette on edges
      const gradient = ctx.createRadialGradient(
        displayWidth / 2,
        displayHeight / 2,
        Math.min(displayWidth, displayHeight) * 0.45,
        displayWidth / 2,
        displayHeight / 2,
        Math.max(displayWidth, displayHeight) * 0.75
      );
      gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
      gradient.addColorStop(1, "rgba(20, 10, 5, 0.45)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, displayWidth, displayHeight);

      ctx.restore();
    },
    [fitMode]
  );

  // Smooth animation loop using lerp
  useEffect(() => {
    const loop = () => {
      const diff = targetFrameRef.current - renderedFrameRef.current;
      if (Math.abs(diff) > 0.05) {
        renderedFrameRef.current += diff * 0.25;
        const frameToDraw = Math.round(renderedFrameRef.current);
        const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, frameToDraw));
        drawFrame(clamped);
        setCurrentFrameIndex(clamped);
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
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors,
      scalar: 1.2,
      ticks: 200,
    });
    setTimeout(() => {
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 40,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
        colors,
      });
    }, 250);
  };

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrollY = window.scrollY;
      const totalScroll = containerRef.current.offsetHeight - window.innerHeight;
      if (totalScroll <= 0) return;

      const progress = Math.max(0, Math.min(1, scrollY / totalScroll));
      const targetFrame = Math.floor(progress * (TOTAL_FRAMES - 1));
      targetFrameRef.current = targetFrame;

      onProgressChange?.(progress);

      // Trigger celebration when invitation unfolds (> 92%)
      if (progress > 0.92 && !hasCelebrated) {
        setHasCelebrated(true);
        triggerPetalCelebration();
        onCardUnfolded?.();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [onProgressChange, onCardUnfolded, hasCelebrated]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      drawFrame(Math.round(renderedFrameRef.current));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawFrame]);

  // Autoplay animation toggle
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        targetFrameRef.current = (targetFrameRef.current + 1) % TOTAL_FRAMES;
        if (targetFrameRef.current === TOTAL_FRAMES - 1) {
          setIsAutoPlaying(false);
          triggerPetalCelebration();
        }
      }, 55);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleSliderScrub = (value: number[]) => {
    setIsAutoPlaying(false);
    const frame = value[0];
    targetFrameRef.current = frame;

    if (containerRef.current) {
      const totalScroll = containerRef.current.offsetHeight - window.innerHeight;
      const newScrollY = (frame / (TOTAL_FRAMES - 1)) * totalScroll;
      window.scrollTo({ top: newScrollY, behavior: "instant" });
    }
  };

  const handleReset = () => {
    setIsAutoPlaying(false);
    targetFrameRef.current = 0;
    renderedFrameRef.current = 0;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleAutoPlay = () => {
    if (targetFrameRef.current >= TOTAL_FRAMES - 1) {
      targetFrameRef.current = 0;
      renderedFrameRef.current = 0;
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    setIsAutoPlaying(!isAutoPlaying);
  };

  const scrollProgress = currentFrameIndex / (TOTAL_FRAMES - 1);

  return (
    <div ref={containerRef} className="relative w-full h-[450vh] bg-[#1a0f0a]">
      {/* Sticky Canvas Container */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex flex-col justify-between">
        {/* The HTML5 Canvas for silky frame scrubbing */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover touch-none"
        />

        {/* Top Floating Controls Bar */}
        <div className="relative z-30 flex items-center justify-between p-4 pt-5 pointer-events-none">
          {/* Couple monogram badge */}
          <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-stone-950/75 backdrop-blur-md shadow-lg">
            <span className="text-xs font-heading font-bold text-amber-300">
              V & A
            </span>
            <span className="text-[10px] text-stone-400">|</span>
            <span className="text-[10px] font-serif text-amber-200">
              വേളി
            </span>
          </div>

          {/* View Mode Toggle (Cover / Contain) */}
          <div className="pointer-events-auto flex items-center gap-1.5">
            <Button
              variant="outline"
              size="iconSm"
              onClick={() => setFitMode(fitMode === "cover" ? "contain" : "cover")}
              className="h-8 w-8 rounded-full border-amber-500/30 bg-stone-950/75 text-amber-300 shadow-md"
              title={fitMode === "cover" ? "Show Full Frame" : "Fill Screen"}
            >
              {fitMode === "cover" ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </Button>
          </div>
        </div>

        {/* Floating Scroll Indicator on Initial Screen */}
        {scrollProgress < 0.1 && (
          <div className="relative z-30 flex flex-col items-center pb-24 text-center pointer-events-none animate-float">
            <div className="px-4 py-2 rounded-full border border-amber-400/40 bg-stone-950/80 backdrop-blur-md shadow-2xl space-y-1">
              <p className="text-xs font-heading tracking-widest text-amber-200 font-semibold">
                SCROLL TO UNFOLD
              </p>
              <div className="flex items-center justify-center gap-1 text-[10px] text-amber-300/80">
                <span>The Wedding Invitation</span>
              </div>
            </div>
            <ChevronDown className="w-6 h-6 text-amber-400 animate-bounce mt-2" />
          </div>
        )}

        {/* Bottom Floating Control Deck (Mobile Optimized) */}
        <div className="relative z-30 p-4 pb-6 w-full max-w-md mx-auto pointer-events-auto">
          <div className="p-3.5 rounded-2xl border border-amber-500/30 bg-stone-950/85 backdrop-blur-xl shadow-2xl space-y-2.5">
            {/* Progress status and percentage */}
            <div className="flex items-center justify-between text-[11px] text-stone-300">
              <span className="font-heading text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {scrollProgress < 0.2
                  ? "Card Cover"
                  : scrollProgress < 0.6
                  ? "Opening Envelope..."
                  : "Invitation Revealed"}
              </span>
              <span className="tabular-nums font-mono text-[10px] text-amber-200/70">
                {Math.round(scrollProgress * 100)}%
              </span>
            </div>

            {/* Interactive scrub slider */}
            <Slider
              value={[currentFrameIndex]}
              max={TOTAL_FRAMES - 1}
              step={1}
              onValueChange={handleSliderScrub}
              className="py-1 cursor-pointer"
            />

            {/* Play/Pause, Reset, and Quick Jump buttons */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5">
                <Button
                  variant="gold"
                  size="sm"
                  onClick={toggleAutoPlay}
                  className="h-8 px-3 text-xs gap-1.5 rounded-lg"
                >
                  {isAutoPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{currentFrameIndex >= TOTAL_FRAMES - 1 ? "Replay" : "Auto Play"}</span>
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="iconSm"
                  onClick={handleReset}
                  className="h-8 w-8 rounded-lg text-amber-300"
                  title="Return to Beginning"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </Button>
              </div>

              {/* Jump to final invitation button */}
              {scrollProgress < 0.85 && (
                <button
                  onClick={() => {
                    targetFrameRef.current = TOTAL_FRAMES - 1;
                    if (containerRef.current) {
                      const totalScroll = containerRef.current.offsetHeight - window.innerHeight;
                      window.scrollTo({ top: totalScroll, behavior: "smooth" });
                    }
                  }}
                  className="text-[11px] text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors font-medium"
                >
                  Skip to Card →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
