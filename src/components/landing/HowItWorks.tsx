"use client";

import { motion } from "framer-motion";
import { ArrowRight, ClipboardList, FileUp, Send, Sparkles } from "lucide-react";

const steps = [
  { icon: ClipboardList, title: "Create your profile", detail: "Add your contact and academic details in a guided form." },
  { icon: FileUp, title: "Share your documents", detail: "Upload the files your chosen course requires." },
  { icon: Send, title: "Submit for review", detail: "Send your application to the admissions team." },
  { icon: Sparkles, title: "Follow your decision", detail: "See updates and next steps right in your dashboard." },
];

export function HowItWorks() {
  return <section id="how-it-works" className="bg-slate-50 px-5 py-20 sm:px-8 sm:py-24"><div className="mx-auto max-w-7xl"><div className="mx-auto max-w-2xl text-center"><p className="text-sm font-bold tracking-wide text-brand-600">HOW IT WORKS</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Four steps to move forward.</h2><p className="mt-4 text-slate-500">Keep the process clear from your first details to the final update.</p></div><div className="relative mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{steps.map(({ icon: Icon, title, detail }, index) => <motion.article key={title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .1 }} className="relative text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-700 shadow-md ring-1 ring-slate-100"><Icon size={23} /></span><span className="mt-4 inline-block text-xs font-bold text-brand-600">STEP 0{index + 1}</span><h3 className="mt-2 font-bold">{title}</h3><p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">{detail}</p>{index < steps.length - 1 && <ArrowRight className="absolute -right-5 top-5 hidden text-slate-300 lg:block" size={19} />}</motion.article>)}</div></div></section>;
}
