"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, ClipboardList, FileText, LayoutDashboard, LogOut, X } from "lucide-react";
import type { Role } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SidebarProps {
  role: Role;
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ role, open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const reducedMotion = useReducedMotion();
  const links: { label: string; href: string; icon: typeof FileText }[] = role === "student"
    ? [
        { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
        { label: "Apply", href: "/student/apply", icon: FileText },
        { label: "Documents", href: "/student/documents", icon: ClipboardList },
        { label: "Status", href: "/student/status", icon: BarChart3 },
      ]
    : [
        { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { label: "Applications", href: "/admin/applications", icon: FileText },
        { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      ];

  return (
    <>
      <AnimatePresence>{open && <motion.button type="button" aria-label="Close navigation" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .2 }} className="fixed inset-0 z-30 bg-slate-950/40 md:hidden" />}</AnimatePresence>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/5 bg-[#0b1020] p-5 text-white shadow-2xl shadow-slate-950/20 transition-transform duration-300 ease-out md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:translate-x-0 md:shadow-none",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between"><Link href="/" className="text-2xl font-bold text-indigo-300">admitly<span className="text-cyan-300">.</span></Link><button className="rounded-lg p-2 text-slate-300 transition-colors hover:bg-white/10 md:hidden" onClick={onClose} aria-label="Close menu"><X size={19} /></button></div>
        <nav className="mt-10 space-y-1">{links.map(({ label, href, icon: Icon }) => <Link key={href} href={href} onClick={onClose} className={cn("group flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-200", pathname === href ? "bg-gradient-to-r from-brand-600 to-indigo-500 text-white shadow-lg shadow-brand-950/30" : "text-slate-300 hover:translate-x-0.5 hover:bg-white/[0.07] hover:text-white")}><Icon size={18} className="transition-transform duration-200 group-hover:scale-110" />{label}</Link>)}</nav>
        <div className="mt-auto border-t border-slate-800 pt-4"><p className="text-sm font-bold">{user?.name}</p><p className="mt-1 truncate text-xs text-slate-400">{user?.email}</p><button onClick={() => void logout().then(() => router.replace("/"))} className="mt-4 flex items-center gap-2 text-sm text-slate-300"><LogOut size={16} />Log out</button></div>
      </aside>
    </>
  );
}

