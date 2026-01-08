import React from 'react';

interface CircularProgressProps {
  progress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 320,
  strokeWidth = 8,
}) => {
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="transform -rotate-90"
    >
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(263, 90%, 65%)" />
          <stop offset="50%" stopColor="hsl(280, 90%, 70%)" />
          <stop offset="100%" stopColor="hsl(263, 90%, 65%)" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background circle */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        className="progress-ring-bg"
        strokeWidth={strokeWidth}
      />

      {/* Progress circle */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        className="progress-ring-fg"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        filter="url(#glow)"
      />

      {/* Tick marks */}
      {Array.from({ length: 60 }).map((_, i) => {
        const angle = (i * 6 * Math.PI) / 180;
        const isMajor = i % 5 === 0;
        const innerRadius = radius - (isMajor ? 15 : 10);
        const outerRadius = radius - 5;

        const x1 = center + innerRadius * Math.cos(angle - Math.PI / 2);
        const y1 = center + innerRadius * Math.sin(angle - Math.PI / 2);
        const x2 = center + outerRadius * Math.cos(angle - Math.PI / 2);
        const y2 = center + outerRadius * Math.sin(angle - Math.PI / 2);

        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={isMajor ? 'hsl(210 40% 98% / 0.4)' : 'hsl(210 40% 98% / 0.15)'}
            strokeWidth={isMajor ? 2 : 1}
          />
        );
      })}
    </svg>
  );
};
