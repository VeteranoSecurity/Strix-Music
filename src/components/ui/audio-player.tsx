"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const formatTime = (seconds: number = 0) => {
  if (!isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const CustomSlider = ({
  value,
  onChange,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}) => {
  return (
    <motion.div
      className={cn(
        "relative w-full h-1 bg-white/20 rounded-full cursor-pointer",
        className
      )}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        onChange(Math.min(Math.max(percentage, 0), 100));
      }}
    >
      <motion.div
        className="absolute top-0 left-0 h-full bg-white rounded-full"
        style={{ width: `${value}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    </motion.div>
  );
};

const AudioPlayer = ({
  src,
  title,
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
}: {
  src: string;
  title?: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  // Sync isPlaying prop with actual audio element
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, src]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(isFinite(p) ? p : 0);
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (value: number) => {
    if (audioRef.current && audioRef.current.duration) {
      const time = (value / 100) * audioRef.current.duration;
      if (isFinite(time)) {
        audioRef.current.currentTime = time;
        setProgress(value);
      }
    }
  };

  if (!src) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="relative flex flex-col mx-auto rounded-full overflow-hidden bg-[#111111b5] shadow-[0_0_20px_rgba(0,0,0,0.2)] backdrop-blur-md p-3 px-5 w-[300px] h-auto border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
      >
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => {
            if (isRepeat && audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play();
            } else if (onNext) {
              onNext();
            }
          }}
          src={src}
          className="hidden"
        />

        <motion.div className="flex flex-col w-full gap-y-1">
          {title && (
            <div className="w-full text-center overflow-hidden mb-1">
              <span className="text-white/90 text-xs font-mono tracking-wider truncate block">
                {title}
              </span>
            </div>
          )}
          {/* Slider */}
          <motion.div className="flex flex-col gap-y-1">
            <CustomSlider
              value={progress}
              onChange={handleSeek}
              className="w-full mt-1"
            />
            <div className="flex items-center justify-between mt-1">
              <span className="text-white/60 text-xs font-mono tracking-wider">
                {formatTime(currentTime)}
              </span>
              <span className="text-white/60 text-xs font-mono tracking-wider">
                {formatTime(duration)}
              </span>
            </div>
          </motion.div>

          {/* Controls */}
          <motion.div className="flex items-center justify-center w-full">
            <div className="flex items-center gap-1 w-fit rounded-2xl px-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => { e.stopPropagation(); setIsShuffle(!isShuffle); }}
                className={cn("text-white/70 hover:text-white hover:bg-white/10 h-8 w-8 rounded-full", isShuffle && "text-white bg-white/10")}
              >
                <Shuffle className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => { e.stopPropagation(); onPrev?.(); }}
                className="text-white hover:bg-white/10 h-8 w-8 rounded-full"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                onClick={(e) => { e.stopPropagation(); onTogglePlay(); }}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 bg-white/10 h-10 w-10 rounded-full mx-1"
              >
                {isPlaying ? <Pause className="h-5 w-5 fill-white" /> : <Play className="h-5 w-5 fill-white" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => { e.stopPropagation(); onNext?.(); }}
                className="text-white hover:bg-white/10 h-8 w-8 rounded-full"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => { e.stopPropagation(); setIsRepeat(!isRepeat); }}
                className={cn("text-white/70 hover:text-white hover:bg-white/10 h-8 w-8 rounded-full", isRepeat && "text-white bg-white/10")}
              >
                <Repeat className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AudioPlayer;
