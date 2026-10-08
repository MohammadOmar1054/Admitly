"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, CloudUpload, FileText, RefreshCw } from "lucide-react";
import { useApplications } from "@/context/ApplicationsContext";
import { DOCUMENT_META } from "@/lib/constants";
import type { DocumentType } from "@/types";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";

export default function StudentDocumentsPage() {
  const { application, loading, upload } = useApplications();
  const [uploading, setUploading] = useState<DocumentType | null>(null);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState<DocumentType | null>(null);

  if (loading) return <div className="grid gap-4 md:grid-cols-2">{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-48" />)}</div>;
  if (!application) return <EmptyState title="No application yet" description="Start an application to add your admission documents." icon={FileText} />;

  const requiredDocuments = Object.entries(DOCUMENT_META).filter(([, meta]) => meta.required);
  const verifiedRequired = requiredDocuments.filter(([type]) => application.documents.find((document) => document.type === type)?.status === "verified").length;
  const onFile = async (type: DocumentType, file: File | undefined) => {
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowed.includes(file.type) || file.size > 5 * 1024 * 1024) {
      window.alert("Choose a JPG, PNG, or PDF file up to 5 MB.");
      return;
    }
    setUploading(type);
    setProgress(8);
    const timer = window.setInterval(() => setProgress((current) => Math.min(current + 15, 90)), 120);
    try {
      await upload(type, { name: file.name, size: file.size });
      setProgress(100);
    } finally {
      window.clearInterval(timer);
      window.setTimeout(() => { setUploading(null); setProgress(0); }, 700);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold text-brand-600">APPLICATION FILES</p><h1 className="mt-2 text-3xl font-bold">Your documents</h1><p className="mt-2 text-slate-500">Upload clear JPG, PNG, or PDF files up to 5 MB.</p></div><div className="w-full max-w-xs"><Progress value={Math.round((verifiedRequired / requiredDocuments.length) * 100)} label={`${verifiedRequired} of ${requiredDocuments.length} required verified`} /></div></div>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Object.entries(DOCUMENT_META).map(([rawType, meta], index) => {
          const type = rawType as DocumentType;
          const document = application.documents.find((item) => item.type === type);
          const active = uploading === type;
          return (
            <motion.div key={type} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
              <Card className={`h-full transition ${dragging === type ? "border-brand-500 bg-brand-50 ring-2 ring-brand-100" : ""}`} onDragOver={(event) => { event.preventDefault(); setDragging(type); }} onDragLeave={() => setDragging(null)} onDrop={(event) => { event.preventDefault(); setDragging(null); void onFile(type, event.dataTransfer.files[0]); }}>
                <div className="flex items-start justify-between gap-3"><span className="rounded-xl bg-brand-50 p-3 text-brand-600"><FileText size={20} /></span><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${document?.status === "verified" ? "bg-emerald-50 text-emerald-700" : document?.status === "rejected" ? "bg-rose-50 text-rose-700" : document?.status === "uploaded" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-600"}`}>{document?.status?.replaceAll("_", " ") ?? "not uploaded"}</span></div>
                <h2 className="mt-4 font-bold">{meta.label}</h2><p className="mt-1 text-xs text-slate-500">{meta.required ? "Required" : "Optional"} · {meta.accepted}</p>
                {document?.fileName && <p className="mt-4 truncate rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">{document.fileName}</p>}
                {document?.rejectionReason && <div className="mt-3 rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-800"><b>Revision needed</b><p className="mt-1">{document.rejectionReason}</p></div>}
                {active && <div className="mt-4"><Progress value={progress} label="Uploading" /></div>}
                {document?.status === "verified" ? <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-emerald-700"><CheckCircle2 size={17} />Verified</div> : <label className="mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-brand-300 bg-brand-50 px-3 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-100">{document?.status === "rejected" ? <RefreshCw size={16} /> : <CloudUpload size={16} />}{dragging === type ? "Drop the file to upload" : document?.status === "rejected" ? "Re-upload document" : document ? "Replace document" : "Choose a document"}<input className="sr-only" type="file" accept=".jpg,.jpeg,.png,.pdf" disabled={active} onChange={(event) => { void onFile(type, event.currentTarget.files?.[0]); event.currentTarget.value = ""; }} /></label>}
                <AnimatePresence>{active && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-2 text-center text-xs text-slate-400">Saving securely…</motion.p>}</AnimatePresence>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
