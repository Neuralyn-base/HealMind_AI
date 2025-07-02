import React from 'react';

export default function AnimatedSessionBackground() {
  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
      <svg width="100%" height="100%" viewBox="0 0 1440 900" fill="none" style={{position:'absolute',top:0,left:0,width:'100%',height:'100%'}}>
        <defs>
          <radialGradient id="bg1" cx="60%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#a8edea" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#a8edea" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="bg2" cx="30%" cy="70%" r="60%">
            <stop offset="0%" stopColor="#fed6e3" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#fed6e3" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="900" cy="300" rx="420" ry="260" fill="url(#bg1)">
          <animate attributeName="cy" values="300;320;280;300" dur="18s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="400" cy="700" rx="380" ry="220" fill="url(#bg2)">
          <animate attributeName="cy" values="700;680;720;700" dur="22s" repeatCount="indefinite" />
        </ellipse>
      </svg>
    </div>
  );
} 