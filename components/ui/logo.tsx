import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
}

export function EClariaLogo({ className = '', size = 'md', variant = 'full' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-24'
  };

  // Golden ratio: 1.618
  const goldenRatio = 1.618;

  const IconSVG = () => (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeClasses[size]} w-auto ${className}`}
    >
      <defs>
        <linearGradient id="letterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4af37" />
          <stop offset="50%" stopColor="#ffd700" />
          <stop offset="100%" stopColor="#b8860b" />
        </linearGradient>
        <filter id="letterGlow">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Background circle using golden ratio proportions */}
      <circle
        cx="32"
        cy="32"
        r="30"
        fill="rgba(212, 175, 55, 0.1)"
        stroke="url(#letterGradient)"
        strokeWidth="1"
        opacity="0.3"
      />

      {/* Letter "E" - Main element using golden ratio proportions */}
      <g transform="translate(20, 16)">
        {/* Main vertical line - height based on golden ratio */}
        <rect
          x="0"
          y="0"
          width="4"
          height={`${32}`}
          fill="url(#letterGradient)"
          filter="url(#letterGlow)"
        />
        
        {/* Top horizontal line - width based on golden ratio */}
        <rect
          x="0"
          y="0"
          width={`${20}`}
          height="4"
          fill="url(#letterGradient)"
          filter="url(#letterGlow)"
        />
        
        {/* Middle horizontal line - shorter by golden ratio */}
        <rect
          x="0"
          y="14"
          width={`${12}`}
          height="4"
          fill="url(#letterGradient)"
          filter="url(#letterGlow)"
        />
        
        {/* Bottom horizontal line - same as top */}
        <rect
          x="0"
          y="28"
          width={`${20}`}
          height="4"
          fill="url(#letterGradient)"
          filter="url(#letterGlow)"
        />
      </g>

      {/* Subtle accent dots using golden ratio spacing */}
      <circle cx="48" cy="20" r="1.5" fill="url(#letterGradient)" opacity="0.6" />
      <circle cx="48" cy="32" r="1" fill="url(#letterGradient)" opacity="0.4" />
      <circle cx="48" cy="44" r="1.5" fill="url(#letterGradient)" opacity="0.6" />
    </svg>
  );

  const TextSVG = () => (
    <svg
      viewBox="0 0 160 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeClasses[size]} w-auto ${className}`}
    >
      <defs>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d4af37" />
          <stop offset="50%" stopColor="#ffd700" />
          <stop offset="100%" stopColor="#b8860b" />
        </linearGradient>
      </defs>
      
      <text
        x="80"
        y="22"
        textAnchor="middle"
        fill="url(#textGradient)"
        fontSize="20"
        fontWeight="600"
        fontFamily="Inter, system-ui, sans-serif"
        letterSpacing="0.05em"
      >
        E-CLARIA
      </text>
    </svg>
  );

  if (variant === 'icon') {
    return <IconSVG />;
  }

  if (variant === 'text') {
    return <TextSVG />;
  }

  // Full logo with icon and text
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <IconSVG />
      <TextSVG />
    </div>
  );
}

export default EClariaLogo;