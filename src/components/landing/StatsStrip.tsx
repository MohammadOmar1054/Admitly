"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCountUp } from "@/hooks/useCountUp";

const stats = [{ value: 12000, suffix: "+", label: "Applications managed" }, { value: 98, suffix: "%", label: "Verified within 48 hours" }, { value: 40, suffix: "+", label: "Programs to explore" }, { value: 24, suffix: "/7", label: "Progress you can track" }];

export function StatsStrip() {
  return <section className="bg-brand-800 px-5 py-10 text-white sm:px-8"><div className="mx-auto grid max-w-7xl grid-cols-2 gap-7 text-center md:grid-cols-4">{stats.map((stat) => <Stat key={stat.label} {...stat} />)}</div></section>;
}

interface StatProps { value: number; suffix: string; label: string }
function Stat({ value, suffix, label }: StatProps) {
  const { count, ref } = useCountUp(value);
  const reducedMotion = useReducedMotion();
  return <motion.div ref={ref as React.Ref<HTMLDivElement>} initial={reducedMotion ? false : { opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}><b className="text-3xl sm:text-4xl">{count.toLocaleString("en-IN")}{suffix}</b><p className="mt-2 text-sm text-indigo-200">{label}</p></motion.div>;
}
