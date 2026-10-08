"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

const particles = Array.from({ length: 34 }, (_, index) => ({
  id: index,
  left: `${(index * 43 + 9) % 100}%`,
  top: `${(index * 61 + 13) % 100}%`,
  size: index % 7 === 0 ? 4 : index % 3 === 0 ? 3 : 2,
  duration: 8 + (index % 7) * 1.7,
  delay: (index % 9) * -1.4,
  driftX: ((index * 17) % 50) - 25,
  driftY: ((index * 23) % 56) - 28,
}));

export function AmbientBackground() {
  const reducedMotion = useReducedMotion();
  const pointerX = useMotionValue(50);
  const pointerY = useMotionValue(40);
  const smoothX = useSpring(pointerX, { stiffness: 45, damping: 20, mass: 0.7 });
  const smoothY = useSpring(pointerY, { stiffness: 45, damping: 20, mass: 0.7 });
  const cursorGlow = useMotionTemplate`radial-gradient(540px circle at ${smoothX}% ${smoothY}%, rgb(16 185 129 / 0.13), transparent 72%)`;

  useEffect(() => {
    if (reducedMotion) return;

    const updatePointer = (event: PointerEvent) => {
      pointerX.set((event.clientX / window.innerWidth) * 100);
      pointerY.set((event.clientY / window.innerHeight) * 100);
    };

    window.addEventListener("pointermove", updatePointer, { passive: true });
    return () => window.removeEventListener("pointermove", updatePointer);
  }, [pointerX, pointerY, reducedMotion]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="ambient-grid absolute inset-0" />
      <motion.div
        className="absolute inset-0 opacity-80 dark:opacity-70"
        style={{ background: cursorGlow }}
      />
      <motion.div
        className="ambient-orb ambient-orb-one absolute -left-48 top-[12%] h-[28rem] w-[28rem] rounded-full"
        animate={reducedMotion ? undefined : { x: [0, 60, -10, 0], y: [0, 36, 76, 0], scale: [1, 1.12, 0.92, 1] }}
        transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="ambient-orb ambient-orb-two absolute -right-48 top-[42%] h-[32rem] w-[32rem] rounded-full"
        animate={reducedMotion ? undefined : { x: [0, -48, 14, 0], y: [0, -52, -12, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 39, repeat: Infinity, ease: "easeInOut" }}
      />
      {!reducedMotion &&
        particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="ambient-particle absolute rounded-full"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              x: [0, particle.driftX, -particle.driftX * 0.5, 0],
              y: [0, particle.driftY, -particle.driftY * 0.6, 0],
              opacity: [0.16, 0.8, 0.28, 0.16],
              scale: [0.75, 1.35, 0.9, 0.75],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
    </div>
  );
}
