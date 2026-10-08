import {
  CheckCircle2,
  ClipboardList,
  Clock,
  FileText,
  Send,
  XCircle,
} from "lucide-react";
import type { ApplicationStatus, DocumentType } from "@/types";

export const COURSES = [
  "B.Tech Computer Science",
  "B.Tech Electronics & Instrumentation",
  "B.Tech Mechanical",
  "B.Tech Civil",
  "BBA",
  "B.Com",
  "B.Sc Physics",
  "BCA",
].map((name, index) => ({
  name,
  code: `C${101 + index}`,
  seats: 60 + index * 10,
  duration: index < 4 ? "4 years" : "3 years",
  minPercentage: index < 4 ? 60 : 50,
}));

export const STATUS_META: Record<
  ApplicationStatus,
  { label: string; color: string; icon: typeof FileText }
> = {
  draft: { label: "Draft", color: "bg-slate-100 text-slate-700", icon: FileText },
  submitted: { label: "Submitted", color: "bg-blue-50 text-blue-700", icon: Send },
  under_review: { label: "Under review", color: "bg-amber-50 text-amber-700", icon: Clock },
  documents_pending: { label: "Documents pending", color: "bg-orange-50 text-orange-700", icon: ClipboardList },
  accepted: { label: "Accepted", color: "bg-emerald-50 text-emerald-700", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "bg-rose-50 text-rose-700", icon: XCircle },
};

export const DOCUMENT_META: Record<
  DocumentType,
  { label: string; required: boolean; accepted: string; maxMB: number }
> = {
  photo: { label: "Passport photo", required: true, accepted: "JPG, PNG, PDF", maxMB: 5 },
  id_proof: { label: "Government ID proof", required: true, accepted: "JPG, PNG, PDF", maxMB: 5 },
  marksheet_10: { label: "Class 10 marksheet", required: true, accepted: "JPG, PNG, PDF", maxMB: 5 },
  marksheet_12: { label: "Class 12 marksheet", required: true, accepted: "JPG, PNG, PDF", maxMB: 5 },
  transfer_certificate: { label: "Transfer certificate", required: true, accepted: "JPG, PNG, PDF", maxMB: 5 },
  category_certificate: { label: "Category certificate", required: false, accepted: "JPG, PNG, PDF", maxMB: 5 },
};

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Delhi",
  "Karnataka",
  "Maharashtra",
  "Tamil Nadu",
  "Uttar Pradesh",
  "West Bengal",
];

export const BOARDS = ["CBSE", "ICSE", "State Board", "Other"];
export const STREAMS = ["Science", "Commerce", "Arts", "Vocational"];
