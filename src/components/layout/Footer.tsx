import Link from "next/link";

export interface FooterProps {
  className?: string;
}

export function Footer({ className = "" }: FooterProps) {
  return (
    <footer className={`border-t border-slate-200 bg-white px-5 py-8 transition-colors dark:border-slate-800 dark:bg-slate-950 sm:px-8 ${className}`}>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/" className="text-xl font-extrabold text-brand-700 dark:text-brand-300">admitly<span className="text-amber-500">.</span></Link>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">A clearer way through admissions.</p>
        </div>
        <div className="flex gap-5 text-sm text-slate-500 dark:text-slate-400">
          <Link href="/login" className="transition-colors hover:text-brand-700 dark:hover:text-brand-300">Sign in</Link>
          <Link href="/register" className="transition-colors hover:text-brand-700 dark:hover:text-brand-300">Apply</Link>
          <a href="/#faq" className="transition-colors hover:text-brand-700 dark:hover:text-brand-300">FAQs</a>
        </div>
        <p className="w-full text-xs text-slate-400 sm:w-auto">© {new Date().getFullYear()} Admitly</p>
      </div>
    </footer>
  );
}
