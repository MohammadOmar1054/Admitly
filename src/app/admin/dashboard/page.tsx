"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock3, FileCheck2, Users } from "lucide-react";
import { useApplications } from "@/context/ApplicationsContext";
import { STATUS_META } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { DonutChart } from "@/components/admin/Charts";
import { useCountUp } from "@/hooks/useCountUp";

const statusList = ["submitted", "under_review", "documents_pending", "accepted", "rejected"] as const;

export default function AdminDashboardPage() {
  const { applications, loading } = useApplications();
  if (loading) return <div className="space-y-4"><Skeleton className="h-12" /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-28" />)}</div><Skeleton className="h-80" /></div>;

  const byStatus = Object.fromEntries(statusList.map((status) => [
    status,
    applications.filter((application) => application.status === status).length,
  ]));
  const attention = applications
    .filter((application) => ["submitted", "documents_pending"].includes(application.status))
    .sort((first, second) => first.createdAt.localeCompare(second.createdAt))
    .slice(0, 5);
  const recent = applications.slice().sort((first, second) => second.updatedAt.localeCompare(first.updatedAt)).slice(0, 6);
  const stats = [
    { label: "Total applications", value: applications.length, icon: Users, tone: "bg-brand-50 text-brand-700" },
    { label: "Awaiting review", value: byStatus.submitted ?? 0, icon: Clock3, tone: "bg-amber-50 text-amber-700" },
    { label: "Documents pending", value: byStatus.documents_pending ?? 0, icon: FileCheck2, tone: "bg-orange-50 text-orange-700" },
    { label: "Accepted", value: byStatus.accepted ?? 0, icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-700" },
  ];
  const chartValues = Object.fromEntries(Object.keys(STATUS_META).map((status) => [
    status,
    applications.filter((application) => application.status === status).length,
  ]));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="text-sm font-semibold text-brand-600">ADMISSIONS DESK</p><h1 className="mt-2 text-3xl font-bold">Dashboard</h1><p className="mt-2 text-slate-500">Your team’s application overview.</p></div>
        <Link href="/admin/applications" className="text-sm font-semibold text-brand-700">Open applications <ArrowRight className="ml-1 inline" size={15} /></Link>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map((item, index) => <StatCard key={item.label} {...item} index={index} />)}</div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="flex items-start justify-between"><div><h2 className="text-lg font-bold">Needs attention</h2><p className="mt-1 text-sm text-slate-500">Applications waiting for an action.</p></div><span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">{attention.length} to review</span></div>
          {attention.length ? <div className="mt-4 divide-y divide-slate-100">{attention.map((application) => <Link key={application.id} href={`/admin/applications/${application.id}`} className="flex items-center justify-between gap-3 py-3"><div><p className="text-sm font-semibold">{application.personal.fullName}</p><p className="mt-1 text-xs text-slate-500">{application.courses.firstChoice} · {application.id}</p></div><Badge status={application.status} /></Link>)}</div> : <p className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">Everything is up to date.</p>}
          <Link href="/admin/applications" className="mt-4 inline-block text-sm font-semibold text-brand-700">View all applications →</Link>
        </Card>
        <Card><h2 className="text-lg font-bold">Application overview</h2><p className="mt-1 text-sm text-slate-500">Distribution by current status.</p><div className="mt-6"><DonutChart values={chartValues} /></div></Card>
      </div>
      <Card className="mt-5">
        <div className="flex items-center justify-between"><div><h2 className="text-lg font-bold">Recent activity</h2><p className="mt-1 text-sm text-slate-500">Latest application updates.</p></div><Link href="/admin/applications" className="text-xs font-semibold text-brand-700">View queue</Link></div>
        <div className="mt-4 divide-y divide-slate-100">{recent.map((application, index) => { const event = application.timeline.at(-1); return <motion.div key={application.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04 }} className="flex flex-wrap items-center justify-between gap-3 py-3"><div className="flex items-center gap-3"><span className="rounded-xl bg-slate-100 p-2 text-slate-500"><Clock3 size={16} /></span><div><p className="text-sm font-semibold">{application.personal.fullName}</p><p className="mt-1 text-xs text-slate-500">{event?.label ?? "Application updated"} · {formatDate(application.updatedAt)}</p></div></div><Badge status={application.status} /></motion.div>; })}</div>
      </Card>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  icon: typeof Users;
  tone: string;
  index: number;
}

function StatCard({ label, value, icon: Icon, tone, index }: StatCardProps) {
  const { count, ref } = useCountUp(value);
  return <motion.div ref={ref as React.Ref<HTMLDivElement>} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}><Card><span className={`inline-flex rounded-xl p-2.5 ${tone}`}><Icon size={19} /></span><p className="mt-4 text-sm text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold">{count.toLocaleString("en-IN")}</p></Card></motion.div>;
}
