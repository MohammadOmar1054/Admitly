"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Circle, ClipboardCheck, FileText, Upload } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useApplications } from "@/context/ApplicationsContext";
import { DOCUMENT_META } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { StudentSummaryCard } from "@/components/student/StudentSummaryCard";
import { Progress } from "@/components/ui/Progress";

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const { application, loading } = useApplications();
  if (loading) return <div className="space-y-4"><Skeleton className="h-16" /><Skeleton className="h-52" /><div className="grid gap-4 sm:grid-cols-3"><Skeleton className="h-28" /><Skeleton className="h-28" /><Skeleton className="h-28" /></div></div>;

  if (!application) return <div><p className="text-sm font-semibold text-brand-600">STUDENT PORTAL</p><h1 className="mt-2 text-3xl font-bold">Welcome, {user?.name.split(" ")[0]}.</h1><p className="mt-2 text-slate-500">Your admission journey starts with one application.</p><EmptyState className="mt-8" title="Start your application" description="Add your personal and academic details, choose a course, and upload your supporting documents." icon={FileText} action={<Link href="/student/apply"><Button>Begin application <ArrowRight className="ml-2 inline" size={16} /></Button></Link>} /></div>;

  const required = Object.entries(DOCUMENT_META).filter(([, meta]) => meta.required);
  const verified = required.filter(([type]) => application.documents.find((document) => document.type === type)?.status === "verified").length;
  const submitted = Boolean(application.submittedAt);
  const checklist = [
    { label: "Complete your personal and academic profile", done: Boolean(application.personal.phone && application.academic.schoolName), icon: ClipboardCheck, href: "/student/apply" },
    { label: "Upload all required documents", done: required.every(([type]) => application.documents.some((document) => document.type === type && document.status !== "rejected")), icon: Upload, href: "/student/documents" },
    { label: "Submit your application for review", done: submitted, icon: CheckCircle2, href: "/student/apply" },
  ];
  const days = submitted ? Math.max(0, Math.floor((Date.now() - new Date(application.submittedAt!).getTime()) / 86_400_000)) : null;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold text-brand-600">STUDENT PORTAL</p><h1 className="mt-2 text-3xl font-bold">Welcome back, {user?.name.split(" ")[0]}.</h1><p className="mt-2 text-slate-500">Here’s where your application stands.</p></div><Link href="/student/status" className="text-sm font-semibold text-brand-700">View status <ArrowRight className="ml-1 inline" size={15} /></Link></div>
      <StudentSummaryCard application={application} />
      <div className="mt-4 grid gap-4 sm:grid-cols-3"><Card><p className="text-xs font-medium text-slate-500">DOCUMENTS VERIFIED</p><p className="mt-1 text-2xl font-bold">{verified}<span className="text-base text-slate-400"> / {required.length}</span></p><Progress className="mt-3" value={Math.round((verified / required.length) * 100)} /></Card><Card><p className="text-xs font-medium text-slate-500">PROFILE COMPLETION</p><p className="mt-1 text-2xl font-bold">{Math.round((Number(Boolean(application.personal.phone)) + Number(Boolean(application.academic.schoolName)) + Number(Boolean(application.courses.firstChoice)) + Number(verified > 0)) / 4 * 100)}%</p><p className="mt-2 text-xs text-slate-400">Based on key application sections</p></Card><Card><p className="text-xs font-medium text-slate-500">DAYS SINCE SUBMISSION</p><p className="mt-1 text-2xl font-bold">{days ?? "—"}</p><p className="mt-2 text-xs text-slate-400">{submitted ? "Your application is in progress" : "Submit when your application is ready"}</p></Card></div>
      <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]"><Card><div className="flex items-center justify-between"><div><h2 className="text-lg font-bold">Next steps</h2><p className="mt-1 text-sm text-slate-500">A few actions to keep your application moving.</p></div><span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">{checklist.filter((item) => item.done).length}/{checklist.length} complete</span></div><div className="mt-5 space-y-2">{checklist.map((item, index) => { const Icon = item.icon; return <motion.div key={item.label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * .06 }}><Link href={item.href} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:bg-slate-50"><span className={item.done ? "text-emerald-600" : "text-slate-300"}>{item.done ? <CheckCircle2 size={19} /> : <Circle size={19} />}</span><Icon size={17} className="text-slate-400" /><span className="flex-1 text-sm font-medium">{item.label}</span><ArrowRight size={15} className="text-slate-400" /></Link></motion.div>; })}</div></Card>
      <Card><div className="flex items-center justify-between"><h2 className="text-lg font-bold">Recent activity</h2><Link href="/student/status" className="text-xs font-semibold text-brand-700">Full timeline</Link></div>{application.timeline.length === 0 ? <p className="mt-5 text-sm text-slate-500">Your activity will appear here.</p> : <div className="mt-5 space-y-4">{application.timeline.slice(-4).reverse().map((event) => <div key={event.id} className="flex gap-3"><span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-500" /><div><p className="text-sm font-medium">{event.label}</p><p className="mt-1 text-xs text-slate-400">{formatDate(event.at)}</p></div></div>)}</div>}</Card></div>
    </div>
  );
}
