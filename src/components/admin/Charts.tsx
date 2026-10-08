"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ApplicationStatus } from "@/types";
import { STATUS_META } from "@/lib/constants";

const chartColors = ["#4f46e5", "#0ea5e9", "#f59e0b", "#f97316", "#10b981", "#f43f5e"];

export interface BarChartProps {
  values: number[];
  labels: string[];
}

export function BarChart({ values, labels }: BarChartProps) {
  const reducedMotion = useReducedMotion();
  const max = Math.max(1, ...values);
  return <div className="flex h-56 items-end gap-3 border-b border-l border-slate-200 px-3 pb-0 pt-5">{values.map((value, index) => <div key={`${labels[index]}-${index}`} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><motion.div initial={reducedMotion ? false : { height: 0 }} animate={{ height: `${Math.max(value ? 8 : 2, value / max * 100)}%` }} transition={{ duration: reducedMotion ? 0 : .6, delay: reducedMotion ? 0 : index * .04 }} className="w-full max-w-10 rounded-t-lg bg-brand-500" title={`${value} applications`} /><span className="mb-2 text-[10px] text-slate-500">{labels[index]}</span></div>)}</div>;
}

export interface DonutChartProps {
  values: Partial<Record<ApplicationStatus, number>>;
}

export function DonutChart({ values }: DonutChartProps) {
  const reducedMotion = useReducedMotion();
  const entries = Object.entries(STATUS_META).map(([status, meta], index) => ({ status: status as ApplicationStatus, label: meta.label, value: values[status as ApplicationStatus] ?? 0, color: chartColors[index] }));
  const total = entries.reduce((sum, entry) => sum + entry.value, 0);
  let cursor = 0;
  const segments = entries.map((entry) => {
    const start = total ? cursor / total * 100 : 0;
    cursor += entry.value;
    const end = total ? cursor / total * 100 : 0;
    return `${entry.color} ${start}% ${end}%`;
  });
  return <div className="flex flex-wrap items-center gap-6"><motion.div initial={reducedMotion ? false : { opacity: 0, scale: .8, rotate: -12 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: reducedMotion ? 0 : .55 }} className="relative h-36 w-36 shrink-0 rounded-full" style={{ background: total ? `conic-gradient(${segments.join(",")})` : "#e2e8f0" }}><div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-white"><b className="text-2xl">{total}</b><span className="text-[10px] text-slate-500">applications</span></div></motion.div><div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-2">{entries.map((entry, index) => <motion.div initial={reducedMotion ? false : { opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: reducedMotion ? 0 : index * .04 }} key={entry.status} className="flex min-w-0 items-center gap-2 text-xs"><span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: entry.color }} /><span className="truncate text-slate-500">{entry.label}</span><b className="ml-auto">{entry.value}</b></motion.div>)}</div></div>;
}

export interface TrendLineProps {
  values: number[];
  labels?: string[];
}

export function TrendLine({ values, labels = [] }: TrendLineProps) {
  const reducedMotion = useReducedMotion();
  if (values.length === 0) return <p className="py-8 text-sm text-slate-500">No trend data is available yet.</p>;
  const max = Math.max(1, ...values);
  const points = values.map((value, index) => `${values.length < 2 ? 50 : index / (values.length - 1) * 100},${92 - value / max * 78}`).join(" ");
  return <div><svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-48 w-full overflow-visible"><defs><linearGradient id="trend-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#6366f1" stopOpacity=".22" /><stop offset="100%" stopColor="#6366f1" stopOpacity="0" /></linearGradient></defs><polygon points={`0,100 ${points} 100,100`} fill="url(#trend-fill)" /><motion.polyline points={points} fill="none" stroke="#4f46e5" strokeWidth="2" vectorEffect="non-scaling-stroke" initial={reducedMotion ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: reducedMotion ? 0 : .9 }} />{values.map((value, index) => <circle key={`${index}-${value}`} cx={values.length < 2 ? 50 : index / (values.length - 1) * 100} cy={92 - value / max * 78} r="1.7" fill="#4f46e5" vectorEffect="non-scaling-stroke" />)}</svg><div className="flex justify-between text-[10px] text-slate-400">{labels.map((label) => <span key={label}>{label}</span>)}</div></div>;
}
