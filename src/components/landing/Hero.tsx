"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock3, FileCheck2, Sparkles } from "lucide-react";
import { fadeUp } from "@/lib/animations";
import { GlitterBackground } from "@/components/ui/GlitterBackground";

const previewSteps = [
  { icon: CheckCircle2, title: "Application submitted", time: "Oct 02 · Complete", complete: true },
  { icon: CheckCircle2, title: "Documents verified", time: "Oct 04 · Complete", complete: true },
  { icon: Clock3, title: "Admissions review", time: "In progress", complete: false },
];

export function Hero() {
  const reducedMotion = useReducedMotion();
  const floatTransition = reducedMotion ? { duration: 0 } : { duration: 4, repeat: Infinity, ease: "easeInOut" as const };
  return <section className="relative isolate overflow-hidden px-5 pb-20 pt-14 sm:px-8 sm:pb-28 sm:pt-20"><div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_22%,#e0e7ff,transparent_28%),radial-gradient(circle_at_84%_45%,#fef3c7,transparent_24%)]" /><GlitterBackground density={22} /><motion.div className="absolute -left-10 top-20 -z-10 h-36 w-36 rounded-full bg-brand-200/60 blur-3xl" animate={reducedMotion ? undefined : { x: [0, 18, 0], y: [0, 14, 0] }} transition={reducedMotion ? { duration: 0 } : { duration: 9, repeat: Infinity }} /><motion.div className="absolute right-4 top-12 -z-10 h-44 w-44 rounded-full bg-amber-200/60 blur-3xl" animate={reducedMotion ? undefined : { x: [0, -14, 0], y: [0, 18, 0] }} transition={reducedMotion ? { duration: 0 } : { duration: 11, repeat: Infinity }} />
    <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
      <div>
        <motion.p variants={fadeUp} initial="hidden" animate="visible" className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white/80 px-3 py-1.5 text-xs font-bold tracking-wide text-brand-700"><Sparkles size={14} /> ADMISSIONS, MADE HUMAN</motion.p>
        <motion.h1 variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.06 }} className="mt-6 max-w-3xl text-5xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-6xl xl:text-7xl">Your next chapter, <span className="bg-gradient-to-r from-brand-600 via-violet-600 to-indigo-500 bg-clip-text text-transparent">beautifully simple.</span></motion.h1>
        <motion.p variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.12 }} className="mt-6 max-w-xl text-lg leading-8 text-slate-600">One clear place to apply, share your documents, and follow your admission from the first step to the final decision.</motion.p>
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.18 }} className="mt-8 flex flex-wrap gap-3"><Link className="rounded-xl bg-brand-600 px-5 py-3 font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700" href="/register">Start your application <ArrowRight className="ml-2 inline" size={17} /></Link><Link className="rounded-xl border border-slate-200 bg-white/80 px-5 py-3 font-semibold text-slate-700 hover:bg-white" href="/login">Explore your dashboard</Link></motion.div>
        <div className="mt-8 flex items-center gap-2 text-sm text-slate-500"><CheckCircle2 size={16} className="text-emerald-600" />Free to apply · Save your progress any time</div>
      </div>
      <div className="relative mx-auto w-full max-w-lg">
        <motion.div animate={reducedMotion ? undefined : { y: [0, -9, 0] }} transition={floatTransition} className="relative rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-2xl shadow-indigo-900/10 backdrop-blur sm:p-7">
          <div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="rounded-xl bg-brand-50 p-3 text-brand-700"><FileCheck2 size={22} /></span><div><p className="text-xs text-slate-500">APPLICATION #ADM-2026-0142</p><p className="mt-1 font-bold">B.Tech Computer Science</p></div></div><span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">In review</span></div>
          <div className="mt-7 rounded-2xl bg-slate-50 p-4"><div className="flex justify-between text-sm"><span className="font-semibold">Application progress</span><span className="font-bold text-brand-700">72%</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200"><motion.div initial={{ width: 0 }} animate={{ width: "72%" }} transition={{ duration: reducedMotion ? 0 : 1, delay: reducedMotion ? 0 : 0.4 }} className="h-full rounded-full bg-gradient-to-r from-brand-600 to-violet-500" /></div><div className="mt-4 flex items-center justify-between text-xs text-slate-500"><span>Submitted</span><span>Decision pending</span></div></div>
          <div className="mt-5 space-y-3">{previewSteps.map(({ icon: Icon, title, time, complete }, index) => <motion.div key={title} initial={reducedMotion ? false : { opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: reducedMotion ? 0 : 0.15 + index * 0.08 }} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3"><Icon size={18} className={complete ? "text-emerald-600" : "text-amber-500"} /><span className="flex-1 text-sm font-medium">{title}</span><span className="text-xs text-slate-400">{time}</span></motion.div>)}</div>
        </motion.div>
        <motion.div animate={reducedMotion ? undefined : { y: [0, 8, 0] }} transition={{ ...floatTransition, duration: 5 }} className="absolute -left-5 top-16 hidden rounded-2xl border border-white bg-white p-4 shadow-xl sm:block"><span className="flex items-center gap-2 text-sm font-semibold"><CheckCircle2 size={17} className="text-emerald-600" />Profile complete</span></motion.div>
        <motion.div animate={reducedMotion ? undefined : { y: [0, -7, 0] }} transition={{ ...floatTransition, duration: 4.5 }} className="absolute -right-3 bottom-12 hidden rounded-2xl border border-white bg-white p-4 shadow-xl sm:block"><p className="text-xs text-slate-500">Next update</p><p className="mt-1 text-sm font-bold">Review in progress</p></motion.div>
      </div>
    </div>
  </section>;
}
