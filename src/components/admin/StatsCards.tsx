"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { Card } from "@/components/ui/Card";

export interface StatsCardItem {
  label: string;
  value: number;
  icon: LucideIcon;
  tone: string;
}

export interface StatsCardsProps {
  items: StatsCardItem[];
}

export function StatsCards({ items }: StatsCardsProps) {
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{items.map((item, index) => <StatCard key={item.label} item={item} index={index} />)}</div>;
}

function StatCard({ item, index }: { item: StatsCardItem; index: number }) {
  const { count, ref } = useCountUp(item.value);
  const Icon = item.icon;
  return <motion.div ref={ref as React.Ref<HTMLDivElement>} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .05 }}><Card><span className={`inline-flex rounded-xl p-2.5 ${item.tone}`}><Icon size={19} /></span><p className="mt-4 text-sm text-slate-500">{item.label}</p><p className="mt-1 text-2xl font-bold">{count.toLocaleString("en-IN")}</p></Card></motion.div>;
}
