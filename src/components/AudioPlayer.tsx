import React, { useEffect, useRef, useState } from "react";
import { Disc3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  autoPlayTriggered: boolean;
  onAudioStarted?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  autoPlayTriggered,
  onAudioStarted,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const userManuallyPausedRef = useRef(false);
  const wasPlayingBeforeHiddenRef = useRef(false);

  useEffect(() => {
    const audio = new Audio("/audio/wedding-bgm.mp3");
    audio.loop = true;
    audio.volume = 0.75;
    audioRef.current = audio;

    const startPlayback = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
        userManuallyPausedRef.current = false;
        onAudioStarted?.();
      } catch {
        setIsPlaying(false);
      }
    };

    if (autoPlayTriggered) {
      startPlayback();
    }

    // First user gesture unlock
    const unlockOnGesture = () => {
      if (audioRef.current && audioRef.current.paused && !userManuallyPausedRef.current) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            onAudioStarted?.();
          })
          .catch(() => {});
      }
      window.removeEventListener("click", unlockOnGesture);
      window.removeEventListener("touchstart", unlockOnGesture);
      window.removeEventListener("scroll", unlockOnGesture);
    };

    window.addEventListener("click", unlockOnGesture, { passive: true });
    window.addEventListener("touchstart", unlockOnGesture, { passive: true });
    window.addEventListener("scroll", unlockOnGesture, { passive: true });

    // Handle tab switching, window minimize, and mobile app backgrounding
    const handleVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio) return;

      if (document.hidden) {
        // Tab switched away or minimized: STOP MUSIC
        if (!audio.paused) {
          wasPlayingBeforeHiddenRef.current = true;
          audio.pause();
          setIsPlaying(false);
        }
      } else {
        // Tab is active again: RESUME MUSIC only if it was playing before
        if (wasPlayingBeforeHiddenRef.current && !userManuallyPausedRef.current) {
          audio
            .play()
            .then(() => {
              setIsPlaying(true);
              wasPlayingBeforeHiddenRef.current = false;
            })
            .catch(() => {
              // Browser may require interaction to resume on mobile
              const resumeOnNextTouch = () => {
                audio
                  .play()
                  .then(() => setIsPlaying(true))
                  .catch(() => {});
                window.removeEventListener("touchstart", resumeOnNextTouch);
                window.removeEventListener("click", resumeOnNextTouch);
              };
              window.addEventListener("touchstart", resumeOnNextTouch, { once: true, passive: true });
              window.addEventListener("click", resumeOnNextTouch, { once: true, passive: true });
            });
        }
      }
    };

    // Mobile Safari / Chrome pagehide & pageshow handlers
    const handlePageHide = () => {
      const audio = audioRef.current;
      if (audio && !audio.paused) {
        wasPlayingBeforeHiddenRef.current = true;
        audio.pause();
        setIsPlaying(false);
      }
    };

    const handlePageShow = () => {
      const audio = audioRef.current;
      if (audio && wasPlayingBeforeHiddenRef.current && !userManuallyPausedRef.current) {
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
            wasPlayingBeforeHiddenRef.current = false;
          })
          .catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("blur", handlePageHide);
    window.addEventListener("focus", handlePageShow);

    return () => {
      window.removeEventListener("click", unlockOnGesture);
      window.removeEventListener("touchstart", unlockOnGesture);
      window.removeEventListener("scroll", unlockOnGesture);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("blur", handlePageHide);
      window.removeEventListener("focus", handlePageShow);
      audio.pause();
      audio.src = "";
    };
  }, [autoPlayTriggered, onAudioStarted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      userManuallyPausedRef.current = true;
      wasPlayingBeforeHiddenRef.current = false;
    } else {
      userManuallyPausedRef.current = false;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          onAudioStarted?.();
        })
        .catch(console.error);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-40">
      <button
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause music" : "Play music"}
        title={isPlaying ? "Pause music" : "Play music"}
        className={cn(
          "relative flex items-center justify-center w-10 h-10 rounded-full border border-amber-500/30 bg-stone-950/80 backdrop-blur-xl shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none",
          isPlaying
            ? "border-amber-400/60 shadow-amber-500/20"
            : "opacity-75 hover:opacity-100"
        )}
      >
        <Disc3
          className={cn(
            "w-5 h-5 text-amber-400 transition-transform duration-700",
            isPlaying && "animate-spin-slow text-amber-300"
          )}
        />
        {isPlaying && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
          </span>
        )}
      </button>
    </div>
  );
};
