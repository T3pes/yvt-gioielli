import * as React from "react";

const D = Math.PI / 180;

/** Corona d'alloro — ornamento classico, disegnata come due rami simmetrici. */
export function Laurel({ className = "" }: { className?: string }) {
  const cx = 100;
  const cy = 100;
  const r = 70;

  const leaves: React.ReactElement[] = [];
  const branches: React.ReactElement[] = [];

  ([-1, 1] as const).forEach((side, bi) => {
    const from = 96;
    const to = 238;
    const pts: string[] = [];
    for (let i = 0; i <= 11; i++) {
      const a = from + ((to - from) * i) / 11;
      const ax = side === 1 ? a : 180 - a; // specchia sull'asse verticale
      const x = cx + r * Math.cos(ax * D);
      const y = cy + r * Math.sin(ax * D);
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);

      if (i === 0) continue;
      // foglia esterna
      const rot = ax + (side === 1 ? 118 : 62);
      leaves.push(
        <ellipse
          key={`o-${bi}-${i}`}
          cx={x + 8 * Math.cos(ax * D)}
          cy={y + 8 * Math.sin(ax * D)}
          rx={13}
          ry={4.6}
          transform={`rotate(${rot} ${x + 8 * Math.cos(ax * D)} ${y + 8 * Math.sin(ax * D)})`}
        />
      );
      // foglia interna, alternata
      if (i % 2 === 0) {
        const xi = x - 9 * Math.cos(ax * D);
        const yi = y - 9 * Math.sin(ax * D);
        leaves.push(
          <ellipse
            key={`i-${bi}-${i}`}
            cx={xi}
            cy={yi}
            rx={10}
            ry={3.6}
            transform={`rotate(${rot - 14} ${xi} ${yi})`}
            opacity={0.75}
          />
        );
      }
    }
    branches.push(
      <polyline key={`b-${bi}`} points={pts.join(" ")} fill="none" strokeWidth={1.1} />
    );
  });

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
    >
      <g strokeWidth={1} opacity={0.95}>
        {leaves}
      </g>
      <g opacity={0.6}>{branches}</g>
    </svg>
  );
}

/** Palmetta greca — divisore. */
export function Palmette({ className = "" }: { className?: string }) {
  const petals = [];
  for (let i = 0; i < 9; i++) {
    const a = -160 + i * 20;
    petals.push(
      <ellipse
        key={i}
        cx={30}
        cy={30 - 14}
        rx={3.1}
        ry={13}
        transform={`rotate(${a + 90} 30 30)`}
        fill="none"
        strokeWidth={1.1}
      />
    );
  }
  return (
    <svg viewBox="0 0 60 44" className={className} aria-hidden="true" stroke="currentColor">
      <g>{petals}</g>
      <path d="M18 36c4 4 20 4 24 0" fill="none" strokeWidth={1.1} />
      <circle cx="30" cy="38" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Angolo a greca (meandro) — cornice decorativa. */
export function MeanderCorner({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path
        d="M2 62V14h48v34H16V26h22v12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        opacity="0.65"
      />
    </svg>
  );
}

/** Segnaposto elegante quando un pezzo non ha ancora fotografie. */
export function PiecePlaceholder({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-[#ece2d1] ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 200 200" className="h-1/2 w-1/2 text-[#a8863f]/35">
        <g fill="none" stroke="currentColor" strokeWidth="1.3">
          <circle cx="100" cy="86" r="42" />
          <circle cx="100" cy="86" r="32" strokeDasharray="2 5" />
          <path d="M100 44c-14 12-14 72 0 84 14-12 14-72 0-84z" />
          <path d="M58 86c12-14 72-14 84 0-12 14-72 14-84 0z" />
          <circle cx="100" cy="86" r="6" fill="currentColor" stroke="none" opacity="0.5" />
          <path d="M70 140h60M78 150h44" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

export function WhatsAppGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.74.46 3.45 1.33 4.95L2 22l5.3-1.39a9.86 9.86 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0 0 12.04 2zm0 18.05h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.03-.2-.31a8.18 8.18 0 0 1-1.26-4.36c0-4.54 3.7-8.23 8.23-8.23 2.2 0 4.26.86 5.82 2.41a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.2-8.23 8.2zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.71-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42l-.48-.01c-.16 0-.43.06-.65.31-.22.25-.85.84-.85 2.04s.87 2.37.99 2.53c.12.16 1.71 2.61 4.15 3.66.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.05.14-1.16-.06-.1-.22-.16-.47-.28z" />
    </svg>
  );
}
