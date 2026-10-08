"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { House, LogOut, Menu, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export interface TopbarProps {
  role: "student" | "admin";
  onMenuClick: () => void;
}

const actionButton =
  "inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-200 hover:bg-brand-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800";

export function Topbar({ role, onMenuClick }: TopbarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-slate-200/80 bg-white/85 px-4 py-3 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80 md:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
        >
          <Menu size={20} />
        </button>
        <div className="min-w-0">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {role === "student" ? "Student portal" : "Admissions desk"}
          </p>
          <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
            {user?.name}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs text-slate-500 dark:bg-slate-900 dark:text-slate-400 lg:flex">
          <Search size={14} /> Your admission, in one place
        </div>
        <Link href="/" className={actionButton} aria-label="Go to home page">
          <House size={16} />
          <span className="hidden sm:inline">Home</span>
        </Link>
        <button
          type="button"
          onClick={() => void handleLogout()}
          className={actionButton}
          aria-label="Log out"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Log out</span>
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}

