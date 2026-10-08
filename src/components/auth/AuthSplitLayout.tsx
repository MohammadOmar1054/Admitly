import Link from "next/link";

export interface AuthSplitLayoutProps {
  children: React.ReactNode;
  register?: boolean;
}

export function AuthSplitLayout({ children, register = false }: AuthSplitLayoutProps) {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="flex items-center justify-center p-5 sm:p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="text-xl font-extrabold text-brand-600">admitly.</Link>
          {children}
        </div>
      </section>
      <aside className="relative hidden flex-col justify-end overflow-hidden bg-gradient-to-br from-brand-700 via-indigo-800 to-violet-950 p-14 text-white lg:flex">
        <div className="absolute -right-16 -top-16 h-80 w-80 rounded-full bg-amber-300/20 blur-3xl" />
        <p className="relative text-brand-100">ONE APPLICATION. EVERY POSSIBILITY.</p>
        <h2 className="relative mt-5 max-w-lg text-5xl font-bold leading-tight">{register ? "Your next chapter starts here." : "Welcome back to your journey."}</h2>
        <p className="relative mt-6 max-w-md text-lg text-indigo-100">Apply, upload and track your admission from a single thoughtful place.</p>
      </aside>
    </main>
  );
}
