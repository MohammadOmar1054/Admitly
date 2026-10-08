import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Application } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { DOCUMENT_META } from "@/lib/constants";

export interface StudentSummaryCardProps {
  application: Application;
}

export function StudentSummaryCard({ application }: StudentSummaryCardProps) {
  const required = Object.entries(DOCUMENT_META).filter(([, meta]) => meta.required);
  const verified = required.filter(([type]) => application.documents.some((document) => document.type === type && document.status === "verified")).length;
  return <Card className="overflow-hidden p-0"><div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-brand-700 to-indigo-900 p-6 text-white"><div><p className="text-xs text-indigo-200">APPLICATION ID · {application.id}</p><h2 className="mt-2 text-xl font-bold">{application.courses.firstChoice || "Course preference not selected"}</h2></div><Badge status={application.status} /></div><div className="flex flex-wrap items-center gap-6 p-5"><div className="min-w-48 flex-1"><Progress value={Math.round(verified / required.length * 100)} label={`${verified} of ${required.length} required documents verified`} /></div><Link href="/student/status" className="text-sm font-semibold text-brand-700">View status <ArrowRight className="ml-1 inline" size={15} /></Link></div></Card>;
}
