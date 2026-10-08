"use client";

import { motion, useReducedMotion } from "framer-motion";

export interface GlitterBackgroundProps {
  density?: number;
  className?: string;
}

const particles = Array.from({ length: 22 }, (_, index) => ({
  id: index,
  left: `${(index * 47 + 11) % 100}%`,
  top: `${(index * 67 + 7) % 100}%`,
  delay: (index % 8) * 0.35,
  duration: 3 + (index % 5) * 0.6,
  size: index % 4 === 0 ? 3 : 2,
}));

export function GlitterBackground({ density = 14, className = "" }: GlitterBackgroundProps) {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
    >
      {particles.slice(0, density).map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-brand-300 shadow-[0_0_10px_2px_rgba(129,140,248,0.55)] dark:bg-cyan-200 dark:shadow-[0_0_12px_2px_rgba(103,232,249,0.6)]"
          style={{ left: particle.left, top: particle.top, width: particle.size, height: particle.size }}
          animate={{ opacity: [0.12, 0.8, 0.18], scale: [0.7, 1.2, 0.8], y: [0, -8, 0] }}
          transition={{ duration: particle.duration, delay: particle.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
