import Link from "next/link";

export function Footer() {
  return <footer className="border-t border-slate-200 bg-white px-5 py-8 sm:px-8"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4"><div><Link href="/" className="text-xl font-extrabold text-brand-700">admitly<span className="text-amber-500">.</span></Link><p className="mt-1 text-xs text-slate-500">A clearer way through admissions.</p></div><div className="flex gap-5 text-sm text-slate-500"><Link href="/login" className="hover:text-brand-700">Sign in</Link><Link href="/register" className="hover:text-brand-700">Apply</Link><a href="#faq" className="hover:text-brand-700">FAQs</a></div><p className="w-full text-xs text-slate-400 sm:w-auto">© {new Date().getFullYear()} Admitly</p></div></footer>;
}
