import { motion } from "framer-motion";

interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
}

export const CircularProgress = ({ 
  progress, 
  size = 140, 
  strokeWidth = 10 
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg
        className="absolute"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth={strokeWidth}
        />
      </svg>

      {/* Progress circle */}
      <svg
        className="absolute -rotate-90 animate-progress-glow"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="white"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          className="text-3xl font-bold text-white"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {progress}%
        </motion.span>
        <span className="text-xs text-white/70 font-medium mt-0.5">Complete</span>
      </div>
    </div>
  );
};
