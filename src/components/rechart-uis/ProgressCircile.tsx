import { ProgressCircleProps } from "@/interfaces/Circle";
import React from "react";


function ProgressCircle({ percentage = 76, size = 80, }: ProgressCircleProps) {
  const strokeWidth = size * 0.04;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#475569"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="opacity-50"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#22c55e"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      
      {/* Percentage Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span 
          className="text-green-400 font-semibold" 
          style={{ fontSize: size * 0.24 }}
        >
          {percentage}%
        </span>
      </div>
    </div>
  );
}

export default ProgressCircle;
