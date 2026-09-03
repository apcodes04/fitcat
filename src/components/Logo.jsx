"use client";

export default function Logo({ className = "h-12 w-auto", showTagline = true, color = "#F7F3E9" }) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <svg viewBox="0 0 300 240" className="h-full w-auto" fill="none" style={{ color: color }}>
        {/* Cat Face Stencil */}
        <g transform="translate(150, 70)" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M -45 -25 L -35 -55 L -12 -35 C -4 -38 4 -38 12 -35 L 35 -55 L 45 -25 C 55 -10 58 10 52 28 C 45 45 25 55 0 55 C -25 55 -45 45 -52 28 C -58 10 -55 -10 -45 -25 Z" />
          <path d="M -30 -30 L -25 -42 L -18 -32" strokeWidth="4"/>
          <path d="M 30 -30 L 25 -42 L 18 -32" strokeWidth="4"/>
          <path d="M -25 -10 Q -18 -18 -10 -10" strokeWidth="5"/>
          <path d="M 10 -10 Q 18 -18 25 -10" strokeWidth="5"/>
          <path d="M -5 2 L 0 -2 L 5 2 Z" fill="currentColor"/>
          <path d="M -16 10 Q 0 30 16 10 Q 0 5 -16 10 Z" fill="currentColor"/>
          <path d="M -48 -5 L -68 -10" strokeWidth="4"/>
          <path d="M -50 8 L -72 8" strokeWidth="4"/>
          <path d="M -48 20 L -68 25" strokeWidth="4"/>
          <path d="M 48 -5 L 68 -10" strokeWidth="4"/>
          <path d="M 50 8 L 72 8" strokeWidth="4"/>
          <path d="M 48 20 L 68 25" strokeWidth="4"/>
        </g>
        <text x="150" y="180" textAnchor="middle" fill="currentColor" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="46" letterSpacing="-1">fitcat</text>
        {showTagline && (
          <text x="150" y="210" textAnchor="middle" fill="currentColor" fontFamily="Georgia, serif" fontStyle="italic" fontSize="16" letterSpacing="0.5">It's meow or never</text>
        )}
      </svg>
    </div>
  );
}
