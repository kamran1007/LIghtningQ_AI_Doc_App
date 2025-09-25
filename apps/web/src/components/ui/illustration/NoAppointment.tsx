type NoAppointmentsIllustrationProps = {
  className?: string;
};

export default function NoAppointmentsIllustration({ className = "" }: NoAppointmentsIllustrationProps) {
  return (
    <div className={`w-full h-full flex items-center justify-center ${className}`}>
      <svg
        width="400"
        height="280"
        viewBox="0 0 400 280"
        xmlns="http://www.w3.org/2000/svg"
        className="max-w-full max-h-full"
      >
        {/* Background gradient */}
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f0fdfa" stopOpacity="1" />
            <stop offset="100%" stopColor="#ccfbf1" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="calendarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="100%" stopColor="#f8fafc" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="tealGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5eead4" stopOpacity="1" />
            <stop offset="100%" stopColor="#2dd4bf" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect width="400" height="280" fill="url(#bgGradient)" rx="12" />

        {/* Main calendar illustration - larger size */}
        <g transform="translate(140, 40)">
          <rect x="3" y="3" width="160" height="120" rx="10" fill="#000000" opacity="0.05" />
          <rect
            x="0"
            y="0"
            width="160"
            height="120"
            rx="10"
            fill="url(#calendarGradient)"
            stroke="#e2e8f0"
            strokeWidth="2"
          />

          {/* Calendar header */}
          <rect x="0" y="0" width="160" height="32" rx="10" fill="url(#tealGradient)" />
          <rect x="0" y="25" width="160" height="7" fill="url(#tealGradient)" />

          {/* Calendar rings */}
          <circle cx="30" cy="16" r="3.5" fill="none" stroke="#ffffff" strokeWidth="2" />
          <circle cx="80" cy="16" r="3.5" fill="none" stroke="#ffffff" strokeWidth="2" />
          <circle cx="130" cy="16" r="3.5" fill="none" stroke="#ffffff" strokeWidth="2" />

          {/* Calendar grid */}
          <g stroke="#e2e8f0" strokeWidth="1" opacity="0.5">
            {/* Vertical lines */}
            {Array.from({ length: 6 }, (_, i) => (
              <line key={i} x1={15 + i * 22} y1="42" x2={15 + i * 22} y2="110" />
            ))}
            {/* Horizontal lines */}
            {Array.from({ length: 3 }, (_, i) => (
              <line key={i} x1="15" y1={55 + i * 18} x2="145" y2={55 + i * 18} />
            ))}
          </g>

          {/* Calendar dates */}
          <g
            fill="#94a3b8"
            fontFamily="Arial, sans-serif"
            fontSize="9"
            textAnchor="middle"
            opacity="0.6"
          >
            {Array.from({ length: 21 }, (_, i) => {
              const row = Math.floor(i / 7);
              const col = i % 7;
              return (
                <text key={i} x={26 + col * 18.5} y={52 + row * 18}>
                  {i + 1}
                </text>
              );
            })}
          </g>
        </g>

        {/* Clock icon - larger */}
        <g transform="translate(70, 110)">
          <circle cx="2" cy="2" r="28" fill="#000000" opacity="0.05" />
          <circle cx="0" cy="0" r="28" fill="#ffffff" stroke="#5eead4" strokeWidth="3" />
          <g
            fill="#5eead4"
            fontFamily="Arial, sans-serif"
            fontSize="8"
            fontWeight="bold"
            textAnchor="middle"
          >
            <text x="0" y="-18">12</text>
            <text x="18" y="3">3</text>
            <text x="0" y="21">6</text>
            <text x="-18" y="3">9</text>
          </g>
          <line x1="0" y1="0" x2="0" y2="-14" stroke="#5eead4" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="0" y1="0" x2="10" y2="0" stroke="#5eead4" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="0" cy="0" r="2.5" fill="#5eead4" />
        </g>

        {/* Stethoscope - larger */}
        <g transform="translate(300, 120)">
          <g transform="translate(2, 2)" opacity="0.05">
            <path
              d="M8 5 Q8 0, 12 0 Q16 0, 16 5 L16 15 Q16 25, 26 25 Q36 25, 36 15 L36 5 Q36 0, 40 0 Q44 0, 44 5"
              stroke="#000000"
              strokeWidth="3"
              fill="none"
            />
            <circle cx="26" cy="35" r="8" stroke="#000000" strokeWidth="3" fill="none" />
          </g>
          <path
            d="M8 5 Q8 0, 12 0 Q16 0, 16 5 L16 15 Q16 25, 26 25 Q36 25, 36 15 L36 5 Q36 0, 40 0 Q44 0, 44 5"
            stroke="#5eead4"
            strokeWidth="3"
            fill="none"
          />
          <circle cx="26" cy="35" r="8" stroke="#5eead4" strokeWidth="3" fill="none" />
          <circle cx="8" cy="5" r="3" fill="#5eead4" />
          <circle cx="44" cy="5" r="3" fill="#5eead4" />
        </g>

        {/* Decorative elements - larger */}
        <g opacity="0.4">
          <circle cx="40" cy="40" r="5" fill="#5eead4" />
          <circle cx="360" cy="50" r="6" fill="#5eead4" />
          <rect x="30" y="220" width="10" height="10" rx="2" fill="#5eead4" />
          <polygon points="350,230 360,220 370,230 370,240 360,250 350,240" fill="#5eead4" />
        </g>

        {/* Main text - larger */}
        <g transform="translate(200, 210)">
          <text
            x="0"
            y="0"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="22"
            fontWeight="600"
            textAnchor="middle"
            fill="#1f2937"
          >
            No Appointments Today
          </text>
          <text
            x="0"
            y="25"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="14"
            textAnchor="middle"
            fill="#6b7280"
          >
            Your schedule is clear and ready for new bookings
          </text>
        </g>
      </svg>
    </div>
  );
}