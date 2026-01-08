import React from 'react';
import { motion } from 'framer-motion';

interface TimeDisplayProps {
  time: number;
  isRunning?: boolean;
}

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);

  return {
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
    centiseconds: centiseconds.toString().padStart(2, '0'),
  };
};

export const TimeDisplay: React.FC<TimeDisplayProps> = ({ time, isRunning }) => {
  const { minutes, seconds, centiseconds } = formatTime(time);

  return (
    <motion.div
      className="flex items-baseline justify-center font-mono select-none"
      animate={isRunning ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <span className="time-digit text-7xl sm:text-8xl md:text-9xl font-bold text-foreground drop-shadow-2xl">
        {minutes}
      </span>
      <span className="time-digit text-6xl sm:text-7xl md:text-8xl font-bold text-primary opacity-80 mx-1">
        :
      </span>
      <span className="time-digit text-7xl sm:text-8xl md:text-9xl font-bold text-foreground drop-shadow-2xl">
        {seconds}
      </span>
      <span className="time-digit text-4xl sm:text-5xl md:text-6xl font-medium text-muted-foreground/60 tabular-nums ml-2">
        .{centiseconds}
      </span>
    </motion.div>
  );
};
