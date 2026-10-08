"use client";

import { Check } from "lucide-react";
import type { Application, DocumentType } from "@/types";
import { DOCUMENT_META } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

export interface DocumentVerifierProps {
  application: Application;
  onVerify: (type: DocumentType) => void;
  onReject: (type: DocumentType) => void;
}

export function DocumentVerifier({ application, onVerify, onReject }: DocumentVerifierProps) {
  return <div className="space-y-3">{Object.entries(DOCUMENT_META).map(([rawType, meta]) => { const type = rawType as DocumentType; const document = application.documents.find((item) => item.type === type); return <div key={type} className="rounded-xl border border-slate-200 p-4"><div className="flex justify-between gap-3"><div><b className="text-sm">{meta.label}</b><p className="mt-1 text-xs text-slate-500">{document?.fileName ?? "Not uploaded"}</p>{document?.rejectionReason && <p className="mt-2 text-sm text-rose-700">{document.rejectionReason}</p>}</div><span className="text-xs capitalize text-slate-500">{document?.status?.replaceAll("_", " ") ?? "missing"}</span></div>{document?.status === "uploaded" && <div className="mt-3 flex gap-2"><Button size="sm" onClick={() => onVerify(type)}><Check size={14} className="mr-1 inline" />Verify</Button><Button size="sm" variant="danger" onClick={() => onReject(type)}>Request revision</Button></div>}</div>; })}</div>;
}
