import React, { useRef, useState } from 'react';

interface Tilt3DCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}

export function Tilt3DCard({ children, className = '', maxTilt = 6 }: Tilt3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('perspective(1100px) rotateX(0deg) rotateY(0deg) translateZ(0px)');
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50, active: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * (maxTilt * 2);
    const rotateX = (0.5 - py) * (maxTilt * 2);

    setTransform(
      `perspective(1100px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(6px)`
    );
    setGlowPos({ x: px * 100, y: py * 100, active: true });
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1100px) rotateX(0deg) rotateY(0deg) translateZ(0px)');
    setGlowPos((prev) => ({ ...prev, active: false }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: glowPos.active
          ? 'transform 120ms cubic-bezier(0.16, 1, 0.3, 1)'
          : 'transform 380ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={`relative will-change-transform ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-200 z-10"
        style={{
          opacity: glowPos.active ? 1 : 0,
          background: `radial-gradient(420px circle at ${glowPos.x}% ${glowPos.y}%, rgba(0, 207, 255, 0.14), rgba(23, 105, 255, 0.04) 45%, transparent 72%)`,
        }}
      />
      {children}
    </div>
  );
}
