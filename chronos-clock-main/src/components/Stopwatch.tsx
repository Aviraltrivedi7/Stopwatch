import React, { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useStopwatch } from '@/hooks/useStopwatch';
import { CircularProgress } from './CircularProgress';
import { TimeDisplay } from './TimeDisplay';
import { StopwatchButton } from './StopwatchButton';
import { LapList } from './LapList';
import { Timer } from 'lucide-react';

export const Stopwatch: React.FC = () => {
  const {
    time,
    state,
    laps,
    bestLapId,
    worstLapId,
    start,
    pause,
    resume,
    reset,
    lap,
  } = useStopwatch();

  // Calculate progress (0-1) based on seconds within a minute
  const seconds = (time / 1000) % 60;
  const progress = seconds / 60;

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

    if (e.code === 'Space') {
      e.preventDefault();
      if (state === 'idle') start();
      else if (state === 'running') pause();
      else if (state === 'paused') resume();
    } else if (e.code === 'KeyR' && state !== 'idle') {
      e.preventDefault();
      reset();
    } else if (e.code === 'KeyL' && state === 'running') {
      e.preventDefault();
      lap();
    }
  }, [state, start, pause, resume, reset, lap]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8 overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] -z-10 animate-pulse" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center gap-2 mb-12"
      >
        <div className="p-4 rounded-3xl bg-primary/10 glass-card mb-2">
          <Timer className="w-10 h-10 text-primary animate-float" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
          Chronos Clock
        </h1>
        <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest">Precision Timer</p>
      </motion.div>

      {/* Main Timer Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative mb-8"
      >
        <CircularProgress progress={progress} size={320} strokeWidth={8} />
        <div className="absolute inset-0 flex items-center justify-center">
          <TimeDisplay time={time} isRunning={state === 'running'} />
        </div>
      </motion.div>

      {/* Control Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-wrap items-center justify-center gap-4 mb-8"
      >
        {state === 'idle' && (
          <StopwatchButton variant="start" onClick={start} />
        )}

        {state === 'running' && (
          <>
            <StopwatchButton variant="lap" onClick={lap} />
            <StopwatchButton variant="pause" onClick={pause} />
          </>
        )}

        {state === 'paused' && (
          <>
            <StopwatchButton variant="reset" onClick={reset} />
            <StopwatchButton variant="resume" onClick={resume} />
          </>
        )}
      </motion.div>

      {/* Keyboard Shortcuts Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-wrap justify-center gap-4 mb-8 text-sm text-muted-foreground"
      >
        <span className="flex items-center gap-2">
          <kbd className="px-2 py-1 rounded bg-secondary text-secondary-foreground font-mono text-xs">
            Space
          </kbd>
          Start/Pause
        </span>
        <span className="flex items-center gap-2">
          <kbd className="px-2 py-1 rounded bg-secondary text-secondary-foreground font-mono text-xs">
            L
          </kbd>
          Lap
        </span>
        <span className="flex items-center gap-2">
          <kbd className="px-2 py-1 rounded bg-secondary text-secondary-foreground font-mono text-xs">
            R
          </kbd>
          Reset
        </span>
      </motion.div>

      {/* Lap List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full max-w-md"
      >
        <LapList laps={laps} bestLapId={bestLapId} worstLapId={worstLapId} />
      </motion.div>
    </div>
  );
};
