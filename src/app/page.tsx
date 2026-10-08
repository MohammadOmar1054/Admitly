import { CallToAction } from "@/components/landing/CallToAction";
import { FAQ } from "@/components/landing/FAQ";
import { Features } from "@/components/landing/Features";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { StatsStrip } from "@/components/landing/StatsStrip";
import { Footer, Navbar } from "@/components/layout";

export default function HomePage() {
  return <main><Navbar /><Hero /><StatsStrip /><Features /><HowItWorks /><FAQ /><CallToAction /><Footer /></main>;
}
