"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { COURSES } from "@/lib/constants";

export interface CourseStepProps {
  value: string;
  percentage12: number;
  error?: string;
  onChange: (course: string) => void;
}

export function CourseStep({ value, percentage12, error, onChange }: CourseStepProps) {
  const reducedMotion = useReducedMotion();
  return (
    <section>
      <h2 className="text-xl font-bold">Choose your course</h2>
      <p className="mt-1 text-sm text-slate-500">Select your first preference. Eligibility is based on your Class 12 percentage.</p>
      {error && <p role="alert" className="mt-3 text-sm text-rose-600">{error}</p>}
      <div className="mt-5 grid gap-3 md:grid-cols-2">{COURSES.map((course, index) => {
        const eligible = percentage12 >= course.minPercentage;
        const selected = value === course.name;
        return <motion.button key={course.code} type="button" onClick={() => onChange(course.name)} initial={reducedMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reducedMotion ? 0 : index * 0.035 }} className={`rounded-2xl border p-4 text-left transition ${selected ? "border-brand-500 bg-brand-50 ring-2 ring-brand-100" : "border-slate-200 hover:border-brand-300"}`}>
          <div className="flex items-start justify-between"><div><p className="font-bold">{course.name}</p><p className="mt-1 text-xs text-slate-500">{course.code} · {course.duration}</p></div>{selected && <CheckCircle2 className="text-brand-600" size={19} />}</div>
          <div className="mt-4 flex items-center justify-between text-xs"><span className="text-slate-500">{course.seats} seats available</span><span className={eligible ? "font-semibold text-emerald-700" : "font-semibold text-amber-700"}>Minimum {course.minPercentage}% · {eligible ? "Eligible" : "Not eligible yet"}</span></div>
        </motion.button>;
      })}</div>
    </section>
  );
}
