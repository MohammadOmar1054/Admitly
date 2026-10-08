"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Application } from "@/types";
import { DOCUMENT_META } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";

export interface ApplicationsTableProps {
  applications: Application[];
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function ApplicationsTable({ applications, page, pageSize, total, onPageChange }: ApplicationsTableProps) {
  const requiredCount = Object.values(DOCUMENT_META).filter((item) => item.required).length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const rangeStart = Math.min(total, (page - 1) * pageSize + 1);
  const rangeEnd = Math.min(total, page * pageSize);
  const content = applications.map((application, index) => {
    const verified = application.documents.filter((document) => document.status === "verified" && DOCUMENT_META[document.type].required).length;
    const progress = Math.round(verified / requiredCount * 100);
    const initials = application.personal.fullName.split(" ").map((part) => part[0]).slice(0, 2).join("");
    return <motion.tr key={application.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .025 }} className="hover:bg-slate-50"><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">{initials}</span><div><p className="text-sm font-semibold">{application.personal.fullName}</p><p className="text-xs text-slate-500">{application.id}</p></div></div></td><td className="px-5 py-4 text-sm">{application.courses.firstChoice || "—"}</td><td className="w-36 px-5 py-4"><Progress value={progress} label={`${verified}/${requiredCount} verified`} /></td><td className="px-5 py-4"><Badge status={application.status} /></td><td className="px-5 py-4 text-sm text-slate-500">{application.submittedAt ? new Date(application.submittedAt).toLocaleDateString("en-IN") : "Draft"}</td><td className="px-5 py-4"><Link className="text-sm font-semibold text-brand-700" href={`/admin/applications/${application.id}`}>Review →</Link></td></motion.tr>;
  });
  const mobileCards = applications.map((application) => <Card key={application.id}><div className="flex items-start justify-between gap-3"><div><p className="font-bold">{application.personal.fullName}</p><p className="mt-1 text-xs text-slate-500">{application.id}</p></div><Badge status={application.status} /></div><p className="mt-4 text-sm text-slate-600">{application.courses.firstChoice}</p><div className="mt-4"><Progress value={Math.round(application.documents.filter((document) => document.status === "verified" && DOCUMENT_META[document.type].required).length / requiredCount * 100)} label="Required documents verified" /></div><Link className="mt-4 inline-block text-sm font-semibold text-brand-700" href={`/admin/applications/${application.id}`}>Review application →</Link></Card>);

  return <><div className="mt-6 hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-4">Applicant</th><th className="px-5 py-4">Course</th><th className="px-5 py-4">Documents</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Submitted</th><th className="px-5 py-4" /></tr></thead><tbody className="divide-y divide-slate-100">{content}</tbody></table></div></div><div className="mt-5 grid gap-3 md:hidden">{mobileCards}</div><div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm"><p className="text-slate-500">Showing {rangeStart}–{rangeEnd} of {total}</p><div className="flex items-center gap-2"><button type="button" aria-label="Previous page" disabled={page === 1} onClick={() => onPageChange(page - 1)} className="rounded-lg border border-slate-200 bg-white p-2 disabled:opacity-40"><ChevronLeft size={17} /></button><span className="px-2">Page {page} of {pages}</span><button type="button" aria-label="Next page" disabled={page >= pages} onClick={() => onPageChange(page + 1)} className="rounded-lg border border-slate-200 bg-white p-2 disabled:opacity-40"><ChevronRight size={17} /></button></div></div></>;
}
