"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const questions = [
  { question: "Can I save my application and finish it later?", answer: "Yes. Your draft is saved as you move through the application, so you can return to complete it whenever you are ready." },
  { question: "Which file types can I upload?", answer: "Documents can be uploaded as JPG, PNG, or PDF files up to 5 MB each. If a document needs a clearer copy, the admissions team will explain why." },
  { question: "How do I know what is happening with my application?", answer: "Your dashboard and status timeline show each milestone, including submission, document review, and the final decision." },
  { question: "Can I update a document after submitting?", answer: "If the admissions team requests a revision, the reason appears beside that document and you can upload a replacement." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return <section id="faq" className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-24"><div className="text-center"><p className="text-sm font-bold tracking-wide text-brand-600">GOOD TO KNOW</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Questions, answered.</h2></div><div className="mt-9 space-y-3">{questions.map((item, index) => <div key={item.question} className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><button type="button" aria-expanded={open === index} onClick={() => setOpen((current) => current === index ? null : index)} className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold"><span>{item.question}</span><ChevronDown size={18} className={`shrink-0 text-slate-400 transition-transform ${open === index ? "rotate-180" : ""}`} /></button><AnimatePresence initial={false}>{open === index && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><p className="px-5 pb-5 text-sm leading-6 text-slate-600">{item.answer}</p></motion.div>}</AnimatePresence></div>)}</div></section>;
}
