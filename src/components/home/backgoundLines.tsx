export function CanvasLines() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-70">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M-40 650C127 586 244 605 411 542C578 479 597 378 796 355C995 332 1095 423 1270 373C1370 344 1458 285 1520 242"
          stroke="url(#paint0_linear)"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="animate-[dash_12s_linear_infinite]"
          strokeDasharray="8 14"
        />
        <path
          d="M-60 710C128 681 265 726 447 666C629 606 697 486 873 472C1050 458 1124 557 1308 520C1411 499 1497 428 1550 396"
          stroke="url(#paint1_linear)"
          strokeWidth="1.2"
          strokeLinecap="round"
          className="animate-[dash_16s_linear_infinite]"
          strokeDasharray="10 18"
        />
        <defs>
          <linearGradient id="paint0_linear" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="rgba(37,99,235,0)" />
            <stop offset="0.35" stopColor="rgba(37,99,235,0.45)" />
            <stop offset="0.7" stopColor="rgba(99,102,241,0.35)" />
            <stop offset="1" stopColor="rgba(37,99,235,0)" />
          </linearGradient>
          <linearGradient id="paint1_linear" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="rgba(14,165,233,0)" />
            <stop offset="0.45" stopColor="rgba(14,165,233,0.28)" />
            <stop offset="0.75" stopColor="rgba(59,130,246,0.22)" />
            <stop offset="1" stopColor="rgba(14,165,233,0)" />
          </linearGradient>
        </defs>
      </svg>
      <style>{`
        @keyframes dash { to { stroke-dashoffset: -120; } }
      `}</style>
    </div>
  );
}