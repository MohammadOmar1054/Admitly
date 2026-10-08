"use client";

import type { ApplicationDocument } from "@/types";
import { DOCUMENT_META } from "@/lib/constants";

export interface DocumentsStepProps {
  documents: ApplicationDocument[];
}

export function DocumentsStep({ documents }: DocumentsStepProps) {
  const required = Object.entries(DOCUMENT_META).filter(([, meta]) => meta.required);
  return <section><h2 className="text-xl font-bold">Supporting documents</h2><p className="mt-2 text-sm text-slate-500">{required.filter(([type]) => documents.some((document) => document.type === type && document.status !== "rejected")).length} of {required.length} required documents added. <a className="font-semibold text-brand-700" href="/student/documents">Upload files</a></p></section>;
}
