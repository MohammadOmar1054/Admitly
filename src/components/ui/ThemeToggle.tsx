"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const saved = window.localStorage.getItem("admitly-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = saved ? saved === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", initial);
    setDark(initial);
    setReady(true);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("admitly-theme", next ? "dark" : "light");
  };

  return (
    <motion.button
      type="button"
      onClick={toggle}
      disabled={!ready}
      whileTap={reducedMotion ? undefined : { scale: 0.92, rotate: 12 }}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={dark}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={`focus grid h-10 w-10 place-items-center rounded-xl border border-slate-200/80 bg-white/75 text-slate-600 shadow-sm backdrop-blur transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 dark:border-slate-700 dark:bg-slate-900/75 dark:text-slate-300 dark:hover:border-brand-500 dark:hover:bg-slate-800 dark:hover:text-brand-300 ${className}`}
    >
      <motion.span key={dark ? "sun" : "moon"} initial={reducedMotion ? false : { opacity: 0, rotate: -35, scale: 0.7 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} transition={{ duration: 0.2 }}>
        {dark ? <Sun size={18} /> : <Moon size={18} />}
      </motion.span>
    </motion.button>
  );
}
