"use client";

export default function Logo({ className = "h-12 w-auto", showTagline = true, color = "#E5C158", cropped = false }) {
  const viewBox = cropped ? "25 5 250 185" : "0 0 300 220";

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox={viewBox} className="h-full w-auto" fill="none" style={{ color: color }}>
        {/* Cat Head Outline & Whiskers from Woodcut Logo */}
        <g stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Main Head Contour */}
          <path d="M 105 45 C 95 30 85 20 80 15 C 80 30 85 45 90 52 C 72 58 55 70 48 85 C 42 78 35 72 25 70 C 32 82 38 90 45 96 C 35 100 28 106 20 114 C 28 116 38 112 48 108 C 42 118 40 126 42 135 C 50 128 58 120 68 114 C 80 135 110 148 150 148 C 190 148 220 135 232 114 C 242 120 250 128 258 135 C 260 126 258 118 252 108 C 262 112 272 116 280 114 C 272 106 265 100 255 96 C 262 90 268 82 275 70 C 265 72 258 78 252 85 C 245 70 228 58 210 52 C 215 45 220 30 220 15 C 215 20 205 30 195 45 C 180 38 165 35 150 35 C 135 35 120 38 105 45 Z" strokeWidth="6.5" />
          
          {/* Slanted Eyes */}
          <path d="M 112 70 L 132 78" strokeWidth="5.5" />
          <path d="M 188 70 L 168 78" strokeWidth="5.5" />
          
          {/* Nose */}
          <polygon points="150,88 143,80 157,80" fill="currentColor" stroke="none" />
          
          {/* Open Smiling Mouth & Chin Line */}
          <path d="M 130 96 C 140 115 160 115 170 96 Q 150 92 130 96 Z" fill="currentColor" stroke="none" />
          <path d="M 135 122 Q 150 130 165 122" strokeWidth="4.5" />
        </g>

        {/* Custom Woodcut Styled "fitcat" Wordmark */}
        <g fill="currentColor">
          {/* 'f' with top curve over 'i' */}
          <path d="M 42 195 V 162 C 42 150 50 142 65 142 C 73 142 82 145 88 150 L 82 160 C 78 157 72 155 67 155 C 60 155 56 158 56 165 V 170 H 80 V 181 H 56 V 195 H 42 Z" />
          
          {/* 'i' */}
          <path d="M 94 170 H 108 V 195 H 94 V 170 Z M 94 150 H 108 V 163 H 94 V 150 Z" />
          
          {/* 't' */}
          <path d="M 118 155 V 170 H 110 V 181 H 118 V 188 C 118 194 123 196 132 196 C 137 196 142 195 146 193 L 144 183 C 141 184 138 185 135 185 C 131 185 130 184 130 181 V 181 H 145 V 170 H 130 V 155 H 118 Z" />
          
          {/* 'c' */}
          <path d="M 182 187 L 174 194 C 168 198 160 200 151 200 C 136 200 126 189 126 172 C 126 156 137 145 152 145 C 162 145 170 148 176 154 L 168 162 C 164 158 158 156 152 156 C 143 156 138 163 138 172 C 138 182 143 189 152 189 C 158 189 164 186 169 181 H 182 V 187 Z" opacity="0.95" />

          {/* Clean 'c', 'a', 't' path representation matching image */}
          <text x="150" y="196" textAnchor="middle" fill="currentColor" fontFamily="'Montserrat', 'Arial Black', sans-serif" fontWeight="900" fontSize="48" letterSpacing="-2">fitcat</text>
        </g>

        {showTagline && (
          <text x="150" y="215" textAnchor="middle" fill="currentColor" fontFamily="Georgia, serif" fontStyle="italic" fontSize="13" letterSpacing="0.5">It's meow or never</text>
        )}
      </svg>
    </div>
  );
}
