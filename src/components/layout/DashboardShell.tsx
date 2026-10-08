"use client";

import { useState } from "react";
import type { Role } from "@/types";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { PageTransition } from "./PageTransition";

export interface DashboardShellProps {
  children: React.ReactNode;
  role: Role;
}

export function DashboardShell({ children, role }: DashboardShellProps) {
  const { authorized } = useAuthGuard(role);
  const [menuOpen, setMenuOpen] = useState(false);
  if (!authorized) return <div className="min-h-screen animate-pulse p-8 text-sm text-slate-400">Loading your workspace…</div>;
  return <div className="min-h-screen bg-slate-50 md:flex"><Sidebar role={role} open={menuOpen} onClose={() => setMenuOpen(false)} /><section className="min-w-0 flex-1"><Topbar role={role} onMenuClick={() => setMenuOpen(true)} /><main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8"><PageTransition>{children}</PageTransition></main></section></div>;
}
