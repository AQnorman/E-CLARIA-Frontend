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

  const IconSVG = () => (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeClasses[size]} w-auto ${className}`}
    >
      {/* Background Circle with Gradient */}
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e5e7eb" />
        </linearGradient>
        <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Main Background Circle */}
      <circle
        cx="32"
        cy="32"
        r="30"
        fill="url(#bgGradient)"
        filter="url(#glow)"
        opacity="0.9"
      />

      {/* Inner Circle for Depth */}
      <circle
        cx="32"
        cy="32"
        r="26"
        fill="rgba(255,255,255,0.1)"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
      />

      {/* Brain/AI Symbol - Central Element */}
      <g transform="translate(20, 18)">
        {/* Brain outline */}
        <path
          d="M12 4C14.5 4 16.5 6 16.5 8.5C16.5 9.5 16.2 10.4 15.7 11.2C17.2 12.1 18 13.8 18 15.5C18 18.5 15.5 21 12.5 21H11.5C8.5 21 6 18.5 6 15.5C6 13.8 6.8 12.1 8.3 11.2C7.8 10.4 7.5 9.5 7.5 8.5C7.5 6 9.5 4 12 4Z"
          fill="url(#brainGradient)"
          stroke="rgba(255,255,255,0.8)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        
        {/* Neural network connections */}
        <circle cx="10" cy="9" r="1.5" fill="#6366f1" opacity="0.8" />
        <circle cx="14" cy="9" r="1.5" fill="#8b5cf6" opacity="0.8" />
        <circle cx="12" cy="12" r="1.5" fill="#f59e0b" opacity="0.8" />
        <circle cx="9" cy="15" r="1.5" fill="#10b981" opacity="0.8" />
        <circle cx="15" cy="15" r="1.5" fill="#ef4444" opacity="0.8" />
        
        {/* Connection lines */}
        <line x1="10" y1="9" x2="12" y2="12" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
        <line x1="14" y1="9" x2="12" y2="12" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
        <line x1="12" y1="12" x2="9" y2="15" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
        <line x1="12" y1="12" x2="15" y2="15" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
      </g>

      {/* Heart Symbol - Representing Social Impact */}
      <g transform="translate(42, 42)">
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill="url(#heartGradient)"
          transform="scale(0.6) translate(-12, -12)"
          opacity="0.9"
        />
      </g>

      {/* Clarity Rays - Representing Clarity and Insight */}
      <g opacity="0.7">
        <line x1="32" y1="8" x2="32" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <line x1="32" y1="52" x2="32" y2="56" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <line x1="8" y1="32" x2="12" y2="32" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <line x1="52" y1="32" x2="56" y2="32" stroke="white" strokeWidth="2" strokeLinecap="round" />
        
        {/* Diagonal rays */}
        <line x1="15.5" y1="15.5" x2="18.5" y2="18.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="48.5" y1="15.5" x2="45.5" y2="18.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="15.5" y1="48.5" x2="18.5" y2="45.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="48.5" y1="48.5" x2="45.5" y2="45.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Central Highlight */}
      <circle
        cx="32"
        cy="32"
        r="3"
        fill="white"
        opacity="0.8"
      />
    </svg>
  );

  const TextSVG = () => (
    <svg
      viewBox="0 0 200 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeClasses[size]} w-auto ${className}`}
    >
      <defs>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="30%" stopColor="#8b5cf6" />
          <stop offset="70%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
      
      <text
        x="100"
        y="28"
        textAnchor="middle"
        fill="url(#textGradient)"
        fontSize="24"
        fontWeight="700"
        fontFamily="Inter, system-ui, sans-serif"
        letterSpacing="-0.02em"
      >
        E-CLARIA
      </text>
      
      {/* Subtle underline */}
      <line
        x1="20"
        y1="32"
        x2="180"
        y2="32"
        stroke="url(#textGradient)"
        strokeWidth="2"
        opacity="0.3"
      />
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