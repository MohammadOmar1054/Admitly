import { CallToAction } from "@/components/landing/CallToAction";
import { FAQ } from "@/components/landing/FAQ";
import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Navbar } from "@/components/landing/Navbar";
import { StatsStrip } from "@/components/landing/StatsStrip";

export default function HomePage() {
  return <main><Navbar /><Hero /><StatsStrip /><Features /><HowItWorks /><FAQ /><CallToAction /><Footer /></main>;
}
