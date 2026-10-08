"use client";

import { motion } from "framer-motion";

export interface StepIndicatorProps {
  steps: string[];
  activeStep: number;
  onStepChange?: (step: number) => void;
}

export function StepIndicator({ steps, activeStep, onStepChange }: StepIndicatorProps) {
  return <div className="grid grid-cols-5 gap-2">{steps.map((step, index) => <button key={step} type="button" disabled={index > activeStep || !onStepChange} onClick={() => onStepChange?.(index)} className="text-left disabled:cursor-default"><span className={`relative flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${index < activeStep ? "bg-emerald-100 text-emerald-700" : index === activeStep ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-400"}`}>{index < activeStep ? "✓" : index + 1}{index === activeStep && <motion.span layoutId="active-step-ring" className="absolute -inset-1 rounded-full border-2 border-brand-300" transition={{ duration: .25 }} />}</span><span className={`mt-2 hidden text-xs font-semibold sm:block ${index === activeStep ? "text-brand-700" : "text-slate-400"}`}>{step}</span></button>)}</div>;
}
