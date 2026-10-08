"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { TimelineEvent } from "@/types";
import { formatDate } from "@/lib/utils";
import { STATUS_META } from "@/lib/constants";

export interface StatusTimelineProps {
  events: TimelineEvent[];
}

export function StatusTimeline({ events }: StatusTimelineProps) {
  const reducedMotion = useReducedMotion();
  return <div>{events.map((event, index) => { const Icon = STATUS_META[event.status].icon; const current = index === events.length - 1; return <motion.div key={event.id} initial={reducedMotion ? false : { opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: reducedMotion ? 0 : index * .06 }} className="relative flex gap-4 pb-7 last:pb-0"><span className={`z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${current ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-600"}`}><Icon size={17} /></span>{index < events.length - 1 && <motion.span initial={reducedMotion ? false : { scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: reducedMotion ? 0 : .35, delay: index * .06 }} className="absolute left-[17px] top-9 h-[calc(100%-2.25rem)] w-px origin-top bg-brand-200" />}<div className="min-w-0 flex-1 pt-1"><div className="flex flex-wrap justify-between gap-2"><p className="font-semibold">{event.label}</p><span className="text-xs text-slate-400">{formatDate(event.at)}</span></div>{event.note && <p className="mt-2 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{event.note}</p>}</div></motion.div>; })}</div>;
}
