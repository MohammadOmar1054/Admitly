"use client";

import { useEffect, useState } from "react";
import { BarChart3, CheckCircle2, Clock3, GraduationCap } from "lucide-react";
import * as api from "@/lib/api";
import type { AnalyticsSummary } from "@/types";
import { BarChart, DonutChart, TrendLine } from "@/components/admin/Charts";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function AdminAnalyticsPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  useEffect(() => {
    void api.getAnalytics().then(setSummary);
  }, []);
  if (!summary) return <div className="space-y-4"><Skeleton className="h-12" /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-28" />)}</div><Skeleton className="h-80" /></div>;

  const stats = [
    { label: "Total applications", value: summary.total.toLocaleString("en-IN"), icon: BarChart3, color: "text-brand-600 bg-brand-50" },
    { label: "Acceptance rate", value: `${summary.acceptanceRate}%`, icon: CheckCircle2, color: "text-emerald-700 bg-emerald-50" },
    { label: "Average score", value: `${summary.averagePercentage}%`, icon: GraduationCap, color: "text-sky-700 bg-sky-50" },
    { label: "Average review time", value: `${summary.averageReviewDays} days`, icon: Clock3, color: "text-amber-700 bg-amber-50" },
  ];

  return (
    <div>
      <p className="text-sm font-semibold text-brand-600">ADMISSIONS DESK</p>
      <h1 className="mt-2 text-3xl font-bold">Analytics</h1>
      <p className="mt-2 text-slate-500">A clear view of application volume and outcomes.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(({ label, value, icon: Icon, color }) => <Card key={label}><span className={`inline-flex rounded-xl p-2.5 ${color}`}><Icon size={19} /></span><p className="mt-4 text-sm text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></Card>)}</div>
      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Card><h2 className="text-lg font-bold">Applications by status</h2><p className="mt-1 text-sm text-slate-500">Current distribution across the review process.</p><div className="mt-6"><DonutChart values={summary.byStatus} /></div></Card>
        <Card><h2 className="text-lg font-bold">Submission activity</h2><p className="mt-1 text-sm text-slate-500">New submissions over the last seven days.</p><div className="mt-4"><BarChart values={summary.weeklySubmissions} labels={weekdayLabels} /></div></Card>
      </div>
      <Card className="mt-5"><h2 className="text-lg font-bold">Course demand</h2><p className="mt-1 text-sm text-slate-500">Application count by first preference.</p>{Object.keys(summary.byCourse).length ? <div className="mt-5"><TrendLine values={Object.values(summary.byCourse)} labels={Object.keys(summary.byCourse)} /></div> : <p className="mt-6 text-sm text-slate-500">Course demand will appear when applications select a preference.</p>}</Card>
    </div>
  );
}
