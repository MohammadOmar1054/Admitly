import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return <main className="flex min-h-screen items-center justify-center px-5"><div className="max-w-md text-center"><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><FileQuestion size={28} /></span><p className="mt-6 text-sm font-bold text-brand-600">404 · PAGE NOT FOUND</p><h1 className="mt-2 text-3xl font-bold">We can’t find that page.</h1><p className="mt-3 text-slate-500">The link may be incorrect, or the page may have moved.</p><Link href="/" className="mt-6 inline-flex items-center rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white"><ArrowLeft className="mr-2" size={16} />Back to Admitly</Link></div></main>;
}
