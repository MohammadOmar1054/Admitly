import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CallToAction() {
  return <section className="px-5 pb-20 sm:px-8 sm:pb-24"><div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-brand-800 via-indigo-800 to-violet-900 px-6 py-14 text-center text-white sm:px-12"><p className="text-sm font-bold tracking-wide text-indigo-200">YOUR NEXT CHAPTER STARTS HERE</p><h2 className="mx-auto mt-3 max-w-2xl text-3xl font-bold sm:text-4xl">Make your application the easy part.</h2><p className="mx-auto mt-4 max-w-xl text-indigo-100">A clearer path to your next opportunity is a few steps away.</p><Link href="/register" className="mt-7 inline-flex items-center rounded-xl bg-amber-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-amber-300">Start your application <ArrowRight className="ml-2" size={17} /></Link></div></section>;
}
