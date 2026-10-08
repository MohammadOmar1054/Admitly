"use client";

import { motion } from "framer-motion";
import { BadgeCheck, FileText, PartyPopper } from "lucide-react";
import { useApplications } from "@/context/ApplicationsContext";
import { STATUS_META } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatusTimeline } from "@/components/student/StatusTimeline";

export default function StudentStatusPage() {
  const { application, loading } = useApplications();
  if (loading) return <div className="space-y-4"><Skeleton className="h-40" /><Skeleton className="h-72" /></div>;
  if (!application) return <EmptyState title="Nothing to track yet" description="Submit your application to see each step of its review." icon={FileText} />;
  const StatusIcon = STATUS_META[application.status].icon;

  return (
    <div>
      <div className={`relative overflow-hidden rounded-3xl p-6 text-white sm:p-9 ${application.status === "accepted" ? "bg-gradient-to-br from-emerald-600 to-teal-800" : application.status === "rejected" ? "bg-gradient-to-br from-rose-600 to-rose-900" : "bg-gradient-to-br from-brand-700 to-indigo-950"}`}>
        <div className="absolute -right-8 -top-10 h-48 w-48 rounded-full bg-white/10 blur-xl" />
        <div className="relative flex items-start gap-4"><span className="rounded-2xl bg-white/15 p-3"><StatusIcon size={27} /></span><div><p className="text-sm text-white/75">APPLICATION STATUS · {application.id}</p><h1 className="mt-2 text-2xl font-bold capitalize sm:text-3xl">{application.status.replaceAll("_", " ")}</h1><p className="mt-2 max-w-xl text-sm text-white/80">{application.status === "accepted" ? "Congratulations! Your application has been accepted." : application.status === "documents_pending" ? "Please review the document feedback and upload the requested files." : "We’ll keep you informed at every step of the review."}</p></div></div>
        {application.status === "accepted" && <motion.div initial={{ scale: 0, rotate: -15 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring" }} className="absolute right-6 top-6 text-amber-200"><PartyPopper size={28} /></motion.div>}
      </div>

      {application.adminRemarks && <Card className="mt-5 border-amber-200 bg-amber-50"><div className="flex gap-3"><BadgeCheck className="shrink-0 text-amber-600" /><div><b>Note from admissions</b><p className="mt-2 text-sm text-slate-700">{application.adminRemarks}</p></div></div></Card>}

      <Card className="mt-5"><div className="flex items-center justify-between"><div><h2 className="text-xl font-bold">Application timeline</h2><p className="mt-1 text-sm text-slate-500">A record of your admission journey.</p></div><Badge status={application.status} /></div>
        <div className="mt-7"><StatusTimeline events={application.timeline} /></div>
      </Card>
    </div>
  );
}
