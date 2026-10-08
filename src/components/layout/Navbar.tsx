import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export interface NavbarProps {
  className?: string;
}

export function Navbar({ className = "" }: NavbarProps) {
  return (
    <nav className={`nav-glow mx-auto flex max-w-7xl items-center justify-between overflow-hidden rounded-2xl px-5 py-4 sm:px-8 ${className}`} aria-label="Main navigation">
      <Link href="/" className="text-2xl font-extrabold tracking-tight text-brand-700 dark:text-brand-300" aria-label="Admitly home">
        admitly<span className="text-amber-500">.</span>
      </Link>
      <div className="flex items-center gap-3 text-sm font-semibold">
        <ThemeToggle />
        <Link className="hidden text-slate-600 transition-colors hover:text-brand-700 dark:text-slate-300 dark:hover:text-brand-300 sm:inline" href="/login">Sign in</Link>
        <Link className="rounded-xl bg-brand-600 px-4 py-2.5 text-white shadow-[0_8px_24px_-10px_rgba(79,70,229,0.8)] transition hover:-translate-y-0.5 hover:bg-brand-700" href="/register">
          Apply now <ArrowRight className="ml-1 inline" size={15} />
        </Link>
      </div>
    </nav>
  );
}
