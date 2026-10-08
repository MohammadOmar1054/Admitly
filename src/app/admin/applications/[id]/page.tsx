"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock3, FileText, X } from "lucide-react";
import * as api from "@/lib/api";
import { useApplications } from "@/context/ApplicationsContext";
import { COURSES, DOCUMENT_META } from "@/lib/constants";
import type { Application, ApplicationStatus, DocumentType } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { Tabs } from "@/components/ui/Tabs";
import { Textarea } from "@/components/ui/Textarea";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/context/ToastContext";
import { ApplicantProfile } from "@/components/admin/ApplicantProfile";
import { DocumentVerifier } from "@/components/admin/DocumentVerifier";
import { DecisionPanel } from "@/components/admin/DecisionPanel";

type Tab = "profile" | "documents" | "history";
type Decision = "under_review" | "documents_pending" | "accepted" | "rejected";

export default function AdminApplicationDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { applications, updateApplicationStatus, verify, reject, refreshApplications, loading } = useApplications();
  const { toast } = useToast();
  const [application, setApplication] = useState<Application | null>(null);
  const [tab, setTab] = useState<Tab>("profile");
  const [decision, setDecision] = useState<Decision | null>(null);
  const [rejectTarget, setRejectTarget] = useState<DocumentType | null>(null);
  const [reason, setReason] = useState("");
  const [remarks, setRemarks] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const fromContext = applications.find((item) => item.id === params.id);
    if (fromContext) setApplication(fromContext);
    else void api.getApplicationById(params.id).then(setApplication);
  }, [applications, params.id]);

  const requiredDocs = Object.entries(DOCUMENT_META).filter(([, meta]) => meta.required);
  const verifiedRequired = application ? requiredDocs.every(([type]) => application.documents.some((document) => document.type === type && document.status === "verified")) : false;

  if (loading && !application) return <div className="space-y-4"><Skeleton className="h-16" /><Skeleton className="h-80" /></div>;
  if (!application) return <EmptyState title="Application not found" description="This application may have been removed or the link is incorrect." icon={FileText} action={<Link href="/admin/applications" className="text-sm font-semibold text-brand-700">Back to applications</Link>} />;

  const decide = async () => {
    if (!decision) return;
    setBusy(true);
    try {
      await updateApplicationStatus(application.id, decision as ApplicationStatus, remarks.trim() || undefined);
      const updated = await api.getApplicationById(application.id);
      setApplication(updated);
      if (decision === "accepted" || decision === "rejected") {
        window.setTimeout(() => router.push("/admin/applications"), 900);
      }
      await refreshApplications();
      setDecision(null);
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Could not update this application.");
    } finally { setBusy(false); }
  };

  const submitRejection = async () => {
    if (!rejectTarget || !reason.trim()) return;
    setBusy(true);
    try {
      await reject(application.id, rejectTarget, reason.trim());
      setApplication(await api.getApplicationById(application.id));
      setRejectTarget(null);
      setReason("");
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Could not request a document revision.");
    } finally { setBusy(false); }
  };

  const verifyOne = async (type: DocumentType) => {
    setBusy(true);
    try {
      await verify(application.id, type);
      setApplication(await api.getApplicationById(application.id));
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Could not verify document.");
    } finally {
      setBusy(false);
    }
  };

  const applicant = application.personal;
  const academic = application.academic;
  const options: { id: Decision; label: string; detail: string; tone: string }[] = [
    { id: "under_review", label: "Move to review", detail: "Mark this application as under review.", tone: "secondary" },
    { id: "documents_pending", label: "Request documents", detail: "Ask the student to revise a document.", tone: "secondary" },
    { id: "accepted", label: "Accept application", detail: "Send an admission offer.", tone: "primary" },
    { id: "rejected", label: "Reject application", detail: "Record a final decision.", tone: "danger" },
  ];

  return (
    <div>
      <Link href="/admin/applications" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800"><ArrowLeft size={15} />All applications</Link>
      <div className="mt-5 flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-semibold text-brand-600">APPLICATION {application.id}</p><h1 className="mt-2 text-3xl font-bold">{applicant.fullName}</h1><p className="mt-1 text-sm text-slate-500">{applicant.email} · Submitted {application.submittedAt ? new Date(application.submittedAt).toLocaleDateString("en-IN") : "Not submitted"}</p></div><Badge status={application.status} /></div>
      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]"><div className="min-w-0"><Card padded={false}><Tabs value={tab} onChange={(value) => setTab(value as Tab)} tabs={[{ id: "profile", label: "Profile" }, { id: "documents", label: `Documents (${application.documents.length})` }, { id: "history", label: "History" }]} /><div className="p-5">
        {tab === "profile" && <div className="space-y-6"><section><h2 className="mb-4 font-bold">Applicant profile</h2><ApplicantProfile application={application} /></section><section className="border-t border-slate-100 pt-5"><h2 className="font-bold">Course preferences</h2><div className="mt-3 space-y-2">{[application.courses.firstChoice, application.courses.secondChoice, application.courses.thirdChoice].filter(Boolean).map((name, index) => { const item = COURSES.find((course) => course.name === name); return <p key={`${name}-${index}`} className="rounded-lg bg-slate-50 p-3 text-sm"><b>{index + 1}.</b> {name}{item && <span className="text-slate-500"> · {item.seats} seats · minimum {item.minPercentage}%</span>}</p>; })}</div></section></div>}
        {tab === "documents" && <DocumentVerifier application={application} onVerify={(type) => void verifyOne(type)} onReject={(type) => { setRejectTarget(type); setReason(""); }} />}
        {tab === "history" && <div className="space-y-4">{application.timeline.slice().reverse().map((event) => <div key={event.id} className="flex gap-3"><span className="mt-1 rounded-full bg-brand-50 p-2 text-brand-700"><Clock3 size={15} /></span><div><p className="text-sm font-semibold">{event.label}</p><p className="mt-1 text-xs text-slate-500">{new Date(event.at).toLocaleString("en-IN")}</p>{event.note && <p className="mt-2 text-sm text-slate-600">{event.note}</p>}</div></div>)}</div>}
      </div></Card></div>
      <aside className="h-fit xl:sticky xl:top-24"><DecisionPanel verifiedRequired={verifiedRequired} onDecision={(nextDecision) => { setDecision(nextDecision as Decision); setRemarks(""); }} /><Card className="mt-4"><label className="block text-xs font-semibold text-slate-600">Internal remarks<Textarea className="mt-2 min-h-24 text-sm font-normal" value={remarks} onChange={(event) => setRemarks(event.target.value)} placeholder="Add a note for the applicant…" /></label></Card></aside></div>
      <Modal open={Boolean(decision)} onClose={() => setDecision(null)} title={decision === "accepted" ? "Accept this application?" : decision === "rejected" ? "Reject this application?" : decision === "documents_pending" ? "Request updated documents?" : "Move to review?"}><p className="text-sm text-slate-600">This updates the status and adds an entry to the student’s timeline.</p>{remarks && <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">Remark: {remarks}</p>}<div className="mt-6 flex justify-end gap-3"><Button variant="secondary" onClick={() => setDecision(null)}>Cancel</Button><Button variant={decision === "rejected" ? "danger" : "primary"} disabled={busy || (decision === "accepted" && !verifiedRequired)} onClick={() => void decide()}>{busy ? "Saving…" : "Confirm decision"}</Button></div></Modal>
      <Modal open={Boolean(rejectTarget)} onClose={() => setRejectTarget(null)} title="Request a document revision"><p className="text-sm text-slate-600">Give the student a clear reason so they know what to correct.</p><Textarea label="Revision reason" value={reason} onChange={(event) => setReason(event.target.value)} className="min-h-28" placeholder="For example: The scan is blurry. Please upload a clearer copy." /><div className="mt-6 flex justify-end gap-3"><Button variant="secondary" onClick={() => setRejectTarget(null)}>Cancel</Button><Button variant="danger" disabled={!reason.trim() || busy} onClick={() => void submitRejection()}><X size={14} className="mr-1 inline" />{busy ? "Saving…" : "Send revision request"}</Button></div></Modal>
    </div>
  );
}
