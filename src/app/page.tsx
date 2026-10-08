import { CallToAction } from "@/components/landing/CallToAction";
import { FAQ } from "@/components/landing/FAQ";
import { Features } from "@/components/landing/Features";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { StatsStrip } from "@/components/landing/StatsStrip";
import { Footer, Navbar } from "@/components/layout";

export default function HomePage() {
  return <main className="min-h-screen text-slate-900 transition-colors duration-300 dark:text-slate-100"><Navbar /><Hero /><StatsStrip /><Features /><HowItWorks /><FAQ /><CallToAction /><Footer /></main>;
}
