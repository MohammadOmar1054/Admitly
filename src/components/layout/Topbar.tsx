"use client";

import { Menu, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export interface TopbarProps {
  role: "student" | "admin";
  onMenuClick: () => void;
}

export function Topbar({ role, onMenuClick }: TopbarProps) {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur md:px-8">
      <div className="flex items-center gap-3"><button type="button" onClick={onMenuClick} aria-label="Open navigation" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"><Menu size={20} /></button><div><p className="text-xs text-slate-500">{role === "student" ? "Student portal" : "Admissions desk"}</p><p className="text-sm font-semibold text-slate-800">{user?.name}</p></div></div>
      <div className="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs text-slate-500 sm:flex"><Search size={14} /> Your admission, in one place</div>
    </header>
  );
}
