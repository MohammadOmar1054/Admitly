"use client";

import { Menu, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export interface TopbarProps {
  role: "student" | "admin";
  onMenuClick: () => void;
}

export function Topbar({ role, onMenuClick }: TopbarProps) {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200/80 bg-white/85 px-4 py-3 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80 md:px-8">
      <div className="flex items-center gap-3"><button type="button" onClick={onMenuClick} aria-label="Open navigation" className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"><Menu size={20} /></button><div><p className="text-xs text-slate-500 dark:text-slate-400">{role === "student" ? "Student portal" : "Admissions desk"}</p><p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user?.name}</p></div></div>
      <div className="flex items-center gap-3"><div className="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs text-slate-500 dark:bg-slate-900 dark:text-slate-400 sm:flex"><Search size={14} /> Your admission, in one place</div><ThemeToggle /></div>
    </header>
  );
}
