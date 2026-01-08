import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Lap } from '@/hooks/useStopwatch';
import { Trophy, AlertTriangle } from 'lucide-react';

interface LapListProps {
  laps: Lap[];
  bestLapId: number | null;
  worstLapId: number | null;
}

const formatLapTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);

  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  }
  return `${seconds}.${centiseconds.toString().padStart(2, '0')}`;
};

export const LapList: React.FC<LapListProps> = ({ laps, bestLapId, worstLapId }) => {
  if (laps.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-muted-foreground">
          Tap "Lap" while running to record lap times
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-4 max-h-[300px] overflow-y-auto scroll-container">
      <div className="flex justify-between items-center px-4 pb-3 border-b border-border mb-3">
        <span className="text-sm font-medium text-muted-foreground">Lap</span>
        <span className="text-sm font-medium text-muted-foreground">Lap Time</span>
        <span className="text-sm font-medium text-muted-foreground">Total</span>
      </div>

      <AnimatePresence mode="popLayout">
        {laps.map((lap) => {
          const isBest = lap.id === bestLapId;
          const isWorst = lap.id === worstLapId;

          return (
            <motion.div
              key={lap.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={cn(
                'flex justify-between items-center px-4 py-4 rounded-2xl mb-3 transition-all duration-300',
                isBest && 'lap-best glow-success border-success/30',
                isWorst && 'lap-worst glow-destructive border-destructive/30',
                !isBest && !isWorst && 'bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06]'
              )}
            >
              <div className="flex items-center gap-2">
                <span className={cn(
                  'font-mono font-medium w-12',
                  isBest && 'text-success',
                  isWorst && 'text-destructive'
                )}>
                  #{lap.lapNumber}
                </span>
                {isBest && <Trophy className="w-4 h-4 text-success" />}
                {isWorst && <AlertTriangle className="w-4 h-4 text-destructive" />}
              </div>

              <span className={cn(
                'font-mono font-semibold text-lg',
                isBest && 'text-success',
                isWorst && 'text-destructive'
              )}>
                {formatLapTime(lap.lapTime)}
              </span>

              <span className="font-mono text-muted-foreground">
                {formatLapTime(lap.totalTime)}
              </span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
