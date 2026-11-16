import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Disc3 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const [isMuted, setIsMuted] = useState(false);
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

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    const nextMute = !isMuted;
    audioRef.current.muted = nextMute;
    setIsMuted(nextMute);
  };

  return (
    <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-stone-950/80 backdrop-blur-xl shadow-xl transition-all duration-300",
          isPlaying ? "border-amber-400/60 shadow-amber-500/20" : "opacity-80"
        )}
      >
        <button
          onClick={togglePlay}
          className="flex items-center gap-2 text-left group focus:outline-none"
          title={isPlaying ? "Pause music" : "Play music"}
        >
          <div className="relative">
            <Disc3
              className={cn(
                "w-5 h-5 text-amber-400 transition-transform duration-700",
                isPlaying && "animate-spin-slow text-amber-300"
              )}
            />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
            )}
          </div>

          <div className="hidden sm:flex flex-col">
            <span className="text-[11px] font-medium tracking-wide text-amber-200">
              {isPlaying ? "Wedding Music" : "Music Paused"}
            </span>
            <span className="text-[9px] text-stone-400">
              {isPlaying ? "Playing BGM" : "Tap to Play"}
            </span>
          </div>
        </button>

        {/* Animated equalizer bars when playing */}
        {isPlaying && (
          <div className="flex items-end gap-0.5 h-3 px-1">
            <span className="w-0.5 bg-amber-400 h-2 animate-[pulse_0.6s_ease-in-out_infinite]"></span>
            <span className="w-0.5 bg-amber-300 h-3.5 animate-[pulse_0.4s_ease-in-out_infinite_0.1s]"></span>
            <span className="w-0.5 bg-amber-400 h-1.5 animate-[pulse_0.5s_ease-in-out_infinite_0.2s]"></span>
            <span className="w-0.5 bg-yellow-400 h-3 animate-[pulse_0.7s_ease-in-out_infinite_0.15s]"></span>
          </div>
        )}

        {/* Mute button */}
        <Button
          variant="ghost"
          size="iconSm"
          onClick={toggleMute}
          className="h-7 w-7 rounded-full text-amber-300 hover:text-white hover:bg-stone-800"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-stone-400" />
          ) : (
            <Volume2 className="w-3.5 h-3.5" />
          )}
        </Button>
      </div>
    </div>
  );
};
