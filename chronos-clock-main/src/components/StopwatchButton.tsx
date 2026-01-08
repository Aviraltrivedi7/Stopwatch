import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StopwatchButtonProps {
  variant: 'start' | 'pause' | 'resume' | 'lap' | 'reset';
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

const variants = {
  start: {
    bg: 'bg-primary hover:bg-primary/90',
    text: 'text-primary-foreground',
    glow: 'glow-primary',
  },
  pause: {
    bg: 'bg-warning/20 hover:bg-warning/30 border border-warning/50',
    text: 'text-warning',
    glow: '',
  },
  resume: {
    bg: 'bg-success hover:bg-success/90',
    text: 'text-success-foreground',
    glow: 'glow-success',
  },
  lap: {
    bg: 'glass-card hover:bg-white/10',
    text: 'text-foreground',
    glow: '',
  },
  reset: {
    bg: 'bg-destructive/20 hover:bg-destructive/30 border border-destructive/50',
    text: 'text-destructive',
    glow: '',
  },
};

const labels = {
  start: 'Start',
  pause: 'Pause',
  resume: 'Resume',
  lap: 'Lap',
  reset: 'Reset',
};

export const StopwatchButton: React.FC<StopwatchButtonProps> = ({
  variant,
  onClick,
  disabled = false,
  className,
}) => {
  const style = variants[variant];

  const handleClick = () => {
    // Trigger vibration on mobile if supported
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    onClick();
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'stopwatch-button px-8 py-4 text-lg font-semibold min-w-[120px]',
        style.bg,
        style.text,
        !disabled && style.glow,
        className
      )}
    >
      {labels[variant]}
    </motion.button>
  );
};
