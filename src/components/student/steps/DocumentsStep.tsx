"use client";

import Link from "next/link";
import { CheckCircle2, Circle, ExternalLink } from "lucide-react";
import type { ApplicationDocument } from "@/types";
import { DOCUMENT_META } from "@/lib/constants";
import { Progress } from "@/components/ui/Progress";

export interface DocumentsStepProps {
  documents: ApplicationDocument[];
  error?: string;
}

export function DocumentsStep({ documents, error }: DocumentsStepProps) {
  const required = Object.entries(DOCUMENT_META).filter(([, meta]) => meta.required);
  const complete = required.filter(([type]) => documents.some((document) => document.type === type && (document.status === "uploaded" || document.status === "verified"))).length;
  return (
    <section>
      <h2 className="text-xl font-bold">Supporting documents</h2>
      <p className="mt-1 text-sm text-slate-500">Add the required files before submitting your application.</p>
      <div className="mt-5"><Progress value={Math.round((complete / required.length) * 100)} label={`${complete} of ${required.length} required documents uploaded`} /></div>
      {error && <p role="alert" className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
      <div className="mt-5 space-y-2">
        {Object.entries(DOCUMENT_META).map(([type, meta]) => {
          const document = documents.find((item) => item.type === type);
          const isReady = document?.status === "uploaded" || document?.status === "verified";
          return <div key={type} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"><span className={isReady ? "text-emerald-600" : "text-slate-300"}>{isReady ? <CheckCircle2 size={19} /> : <Circle size={19} />}</span><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{meta.label}{!meta.required && <span className="ml-2 text-xs font-normal text-slate-400">Optional</span>}</p><p className="mt-1 truncate text-xs text-slate-500">{document?.rejectionReason ? `Revision needed: ${document.rejectionReason}` : document?.fileName ?? "No file uploaded"}</p></div><span className={`shrink-0 text-xs font-semibold ${document?.status === "rejected" ? "text-rose-700" : isReady ? "text-emerald-700" : "text-slate-400"}`}>{document?.status?.replaceAll("_", " ") ?? (meta.required ? "required" : "optional")}</span></div>;
        })}
      </div>
      <Link href="/student/documents" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-700">Upload or replace documents <ExternalLink size={15} /></Link>
    </section>
  );
}
