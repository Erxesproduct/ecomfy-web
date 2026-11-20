import Image from "next/image";

/** The shop's round logo (plum disc, «Kids · Toys · Gifts») next to the wordmark: green «e», plum «Comfy». */
export function Logo({ light = false, className = "" }: { light?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image src="/brand/logo.webp" alt="" width={48} height={48} className="h-11 w-11 shrink-0 rounded-full shadow-[0_3px_0_rgb(42_13_46/0.35)] md:h-12 md:w-12" priority />
      <span className="flex flex-col leading-none">
        <span className={`display text-[24px] font-extrabold tracking-[-0.03em] md:text-[26px] ${light ? "text-white" : "text-plum"}`}>
          <span className="text-leaf">e</span>Comfy
        </span>
        <span className={`display mt-0.5 text-[11px] font-semibold tracking-[0.08em] ${light ? "text-white/70" : "text-ink-3"}`}>KIDS · TOYS · GIFTS</span>
      </span>
    </span>
  );
}

/** The banner's smiling sun. */
export function Sun({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <g className="spin-slow origin-center [transform-box:fill-box]">
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x="57" y="2" width="6" height="20" rx="3" fill="#ffc23c" transform={`rotate(${i * 30} 60 60)`} />
        ))}
      </g>
      <circle cx="60" cy="60" r="30" fill="#ffd45c" stroke="#ffb020" strokeWidth="3" />
      <circle cx="50" cy="56" r="3.2" fill="#2b1630" />
      <circle cx="70" cy="56" r="3.2" fill="#2b1630" />
      <circle cx="44" cy="66" r="4" fill="#ff8fb8" opacity=".7" />
      <circle cx="76" cy="66" r="4" fill="#ff8fb8" opacity=".7" />
      <path d="M50 67q10 9 20 0" fill="none" stroke="#2b1630" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** A five-point star like the ones on the banner. */
export function Star({ className = "", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill={color} d="M12 1.8l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 16.7l-6.1 3.5 1.5-6.8L2.2 8.8l6.9-.7L12 1.8z" strokeLinejoin="round" />
    </svg>
  );
}

/** The wooden toy train from the banner, drawn: engine + three block wagons. */
export function Train({ className = "" }: { className?: string }) {
  const wheel = (x: number) => (
    <g key={x}>
      <circle cx={x} cy="92" r="10" fill="#2b1630" />
      <circle cx={x} cy="92" r="4" fill="#ffc23c" />
    </g>
  );
  return (
    <svg viewBox="0 0 420 110" className={className} aria-hidden>
      {/* wagons */}
      <rect x="8" y="50" width="70" height="36" rx="6" fill="#2fa8f0" />
      <rect x="18" y="30" width="24" height="22" rx="4" fill="#ffc23c" />
      <rect x="46" y="22" width="22" height="30" rx="11" fill="#ff6b4a" />
      <rect x="90" y="50" width="70" height="36" rx="6" fill="#3fae49" />
      <path d="M100 50l18-26 18 26z" fill="#ff6fb5" />
      <rect x="138" y="32" width="16" height="20" rx="3" fill="#7c5cff" />
      <rect x="172" y="50" width="70" height="36" rx="6" fill="#ffc23c" />
      <circle cx="194" cy="38" r="13" fill="#ff6b4a" />
      <rect x="212" y="26" width="22" height="26" rx="4" fill="#14b8a6" />
      {/* engine */}
      <rect x="254" y="44" width="120" height="42" rx="8" fill="#ff6b4a" />
      <rect x="320" y="14" width="54" height="40" rx="8" fill="#d6431f" />
      <rect x="330" y="22" width="34" height="20" rx="4" fill="#e1f2fd" />
      <rect x="270" y="20" width="18" height="26" rx="4" fill="#2b1630" />
      <rect x="264" y="12" width="30" height="10" rx="5" fill="#ffc23c" />
      <rect x="374" y="62" width="30" height="16" rx="6" fill="#ffc23c" />
      {/* couplings */}
      <rect x="76" y="70" width="16" height="6" rx="3" fill="#2b1630" />
      <rect x="158" y="70" width="16" height="6" rx="3" fill="#2b1630" />
      <rect x="240" y="70" width="16" height="6" rx="3" fill="#2b1630" />
      {[28, 60, 110, 142, 192, 224, 278, 316, 354].map(wheel)}
    </svg>
  );
}
