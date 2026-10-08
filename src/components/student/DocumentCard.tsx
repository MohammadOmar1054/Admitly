import { CheckCircle2, FileText } from "lucide-react";
import type { ApplicationDocument } from "@/types";
import { Card } from "@/components/ui/Card";
import { DocumentUploader } from "./DocumentUploader";

export interface DocumentCardProps {
  title: string;
  required: boolean;
  document?: ApplicationDocument;
  onFile: (file: File) => void;
}

export function DocumentCard({ title, required, document, onFile }: DocumentCardProps) {
  return <Card interactive><div className="flex items-start justify-between"><span className="rounded-xl bg-brand-50 p-3 text-brand-700"><FileText size={19} /></span><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${document?.status === "verified" ? "bg-emerald-50 text-emerald-700" : document?.status === "rejected" ? "bg-rose-50 text-rose-700" : "bg-slate-100 text-slate-600"}`}>{document?.status?.replaceAll("_", " ") ?? "not uploaded"}</span></div><h3 className="mt-4 font-bold">{title} {!required && <span className="text-xs font-normal text-slate-400">Optional</span>}</h3>{document?.fileName && <p className="mt-2 truncate text-xs text-slate-500">{document.fileName}</p>}{document?.rejectionReason && <p className="mt-3 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{document.rejectionReason}</p>}{document?.status === "verified" ? <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-emerald-700"><CheckCircle2 size={16} />Verified</p> : <div className="mt-4"><DocumentUploader onFile={onFile} /></div>}</Card>;
}
