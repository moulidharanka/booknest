export default function Logo({ size = 34, className = '' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ verticalAlign: 'middle', flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="navBookGrad" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="50%" stopColor="#764ba2" />
          <stop offset="100%" stopColor="#9333ea" />
        </linearGradient>
        <linearGradient id="navPageGrad" x1="16" y1="14" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e0e7ff" />
        </linearGradient>
        <linearGradient id="navAccentGrad" x1="12" y1="36" x2="52" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38ef7d" />
          <stop offset="100%" stopColor="#11998e" />
        </linearGradient>
      </defs>

      {/* Book Hardcover Wings */}
      <path 
        d="M32 18 C24 10 14 11 8 13 C7 13.3 6.5 14.2 6.5 15.2 L6.5 45.5 C6.5 46.8 7.6 47.7 8.9 47.5 C15.5 46.2 24.5 47.5 32 53 C39.5 47.5 48.5 46.2 55.1 47.5 C56.4 47.7 57.5 46.8 57.5 45.5 L57.5 15.2 C57.5 14.2 57 13.3 56 13 C50 11 40 10 32 18 Z" 
        fill="url(#navBookGrad)" 
      />

      {/* Left Open Pages */}
      <path d="M31 20 C24 13 16 13.5 10 15.5 L10 43.5 C16 42 24 43 31 48 Z" fill="url(#navPageGrad)" opacity="0.95" />
      <path d="M31 22.5 C24.5 16 17.5 16.5 12 18.2 L12 42.5 C17.5 41.2 24.5 42 31 46.5 Z" fill="#ffffff" />

      {/* Right Open Pages */}
      <path d="M33 20 C40 13 48 13.5 54 15.5 L54 43.5 C48 42 40 43 33 48 Z" fill="url(#navPageGrad)" opacity="0.95" />
      <path d="M33 22.5 C39.5 16 46.5 16.5 52 18.2 L52 42.5 C46.5 41.2 39.5 42 33 46.5 Z" fill="#ffffff" />

      {/* Ribbon Bookmark */}
      <path d="M30.5 18 L33.5 18 L33.5 49 L32 47.8 L30.5 49 Z" fill="#4f46e5" />

      {/* The Nest Swoop Arch */}
      <path d="M12 48.5 C22 55 42 55 52 48.5 C45 54 19 54 12 48.5 Z" fill="url(#navAccentGrad)" />

      {/* Digital Knowledge Sparkle Star */}
      <path d="M32 6 L33.5 11 L38.5 12.5 L33.5 14 L32 19 L30.5 14 L25.5 12.5 L30.5 11 Z" fill="#38ef7d" />
    </svg>
  );
}
