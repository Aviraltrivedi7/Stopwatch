import { useState, useRef, useCallback, useEffect } from 'react';

export interface Lap {
  id: number;
  lapNumber: number;
  lapTime: number;
  totalTime: number;
}

export type StopwatchState = 'idle' | 'running' | 'paused';

export const useStopwatch = () => {
  const [time, setTime] = useState(0);
  const [state, setState] = useState<StopwatchState>('idle');
  const [laps, setLaps] = useState<Lap[]>([]);
  
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);

  const updateTime = useCallback(() => {
    const now = performance.now();
    const elapsed = now - startTimeRef.current + accumulatedTimeRef.current;
    setTime(elapsed);
  }, []);

  const start = useCallback(() => {
    if (state === 'running') return;
    
    startTimeRef.current = performance.now();
    setState('running');
    
    intervalRef.current = window.setInterval(updateTime, 10);
  }, [state, updateTime]);

  const pause = useCallback(() => {
    if (state !== 'running') return;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    accumulatedTimeRef.current = time;
    setState('paused');
  }, [state, time]);

  const resume = useCallback(() => {
    if (state !== 'paused') return;
    
    startTimeRef.current = performance.now();
    setState('running');
    
    intervalRef.current = window.setInterval(updateTime, 10);
  }, [state, updateTime]);

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setTime(0);
    setState('idle');
    setLaps([]);
    startTimeRef.current = 0;
    accumulatedTimeRef.current = 0;
  }, []);

  const lap = useCallback(() => {
    if (state !== 'running') return;
    
    const lastLapTotal = laps.length > 0 ? laps[0].totalTime : 0;
    const lapTime = time - lastLapTotal;
    
    const newLap: Lap = {
      id: Date.now(),
      lapNumber: laps.length + 1,
      lapTime,
      totalTime: time,
    };
    
    setLaps(prev => [newLap, ...prev]);
  }, [state, time, laps]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Calculate best and worst lap
  const { bestLapId, worstLapId } = (() => {
    if (laps.length < 2) return { bestLapId: null, worstLapId: null };
    
    let best = laps[0];
    let worst = laps[0];
    
    for (const l of laps) {
      if (l.lapTime < best.lapTime) best = l;
      if (l.lapTime > worst.lapTime) worst = l;
    }
    
    return { bestLapId: best.id, worstLapId: worst.id };
  })();

  return {
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
  };
};
