import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Navbar() {
  return <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8"><Link href="/" className="text-2xl font-extrabold tracking-tight text-brand-700">admitly<span className="text-amber-500">.</span></Link><div className="flex items-center gap-3 text-sm font-semibold"><Link className="hidden text-slate-600 hover:text-brand-700 sm:inline" href="/login">Sign in</Link><Link className="rounded-xl bg-brand-600 px-4 py-2.5 text-white shadow-sm transition hover:bg-brand-700" href="/register">Apply now <ArrowRight className="ml-1 inline" size={15} /></Link></div></nav>;
}
