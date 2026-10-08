"use client";

import { motion } from "framer-motion";
import { BadgeCheck, BookOpenCheck, FileCheck2, LayoutDashboard, ShieldCheck, TimerReset } from "lucide-react";
import { staggerContainer, fadeUp } from "@/lib/animations";

const features = [
  { icon: FileCheck2, title: "One clear application", detail: "A guided form keeps your details together and saves as you go." },
  { icon: ShieldCheck, title: "Documents, in order", detail: "Upload once, see what is verified, and get a clear reason if something needs an update." },
  { icon: TimerReset, title: "Live status updates", detail: "Follow each review milestone without wondering what happens next." },
  { icon: BookOpenCheck, title: "Find your course", detail: "Compare program requirements and choose the right fit for your goals." },
  { icon: LayoutDashboard, title: "A calmer admissions desk", detail: "Admissions teams can search, review, and make decisions in one workspace." },
  { icon: BadgeCheck, title: "Clear decisions", detail: "Every request and outcome is recorded in your application timeline." },
];

export function Features() {
  return <section id="features" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24"><div className="max-w-2xl"><p className="text-sm font-bold tracking-wide text-brand-600">BUILT FOR CLARITY</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Everything admissions needs. Nothing in the way.</h2><p className="mt-4 text-slate-500">A thoughtful experience for students and the teams guiding them.</p></div><motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: .15 }} className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{features.map(({ icon: Icon, title, detail }) => <motion.article variants={fadeUp} whileHover={{ y: -4 }} key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"><span className="inline-flex rounded-xl bg-brand-50 p-3 text-brand-700"><Icon size={21} /></span><h3 className="mt-5 text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{detail}</p></motion.article>)}</motion.div></section>;
}
