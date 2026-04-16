'use client';

import { useRef, type ReactNode } from 'react';

interface TiltProps {
  children: ReactNode;
  maxTilt?: number;
  className?: string;
}

/**
 * Subtle 3D tilt on mouse-move using CSS transforms.
 * No Three.js — pure transform-style preserve-3d + rotateX/rotateY.
 * Auto-disabled on touch devices and prefers-reduced-motion.
 */
export function Tilt({ children, maxTilt = 4, className }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;

    const isTouch = window.matchMedia('(hover: none)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || reduced) return;

    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.transform = `perspective(1400px) rotateY(${x * maxTilt}deg) rotateX(${-y * maxTilt}deg)`;
    });
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    if (raf.current) cancelAnimationFrame(raf.current);
    el.style.transform = 'perspective(1400px) rotateY(0) rotateX(0)';
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{
        transformStyle: 'preserve-3d',
        transition: 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}
