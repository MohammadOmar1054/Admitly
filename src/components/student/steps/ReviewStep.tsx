import type { AcademicDetails, ApplicationDocument, PersonalDetails } from "@/types";
import { DOCUMENT_META } from "@/lib/constants";

export interface ReviewStepProps {
  personal: PersonalDetails;
  academic: AcademicDetails;
  course: string;
  documents: ApplicationDocument[];
}

export function ReviewStep({ personal, academic, course, documents }: ReviewStepProps) {
  const required = Object.entries(DOCUMENT_META).filter(([, meta]) => meta.required);
  const uploaded = required.filter(([type]) => documents.some((document) => document.type === type && (document.status === "uploaded" || document.status === "verified"))).length;
  const rows: [string, string][] = [
    ["Applicant", personal.fullName],
    ["Email", personal.email],
    ["Phone", personal.phone],
    ["Address", `${personal.address}, ${personal.city}, ${personal.state} ${personal.pincode}`],
    ["Class 10", `${academic.board10} · ${academic.percentage10}% · ${academic.year10}`],
    ["Class 12", `${academic.board12} · ${academic.stream12} · ${academic.percentage12}% · ${academic.year12}`],
    ["School", academic.schoolName],
    ["Course preference", course],
    ["Required documents", `${uploaded} of ${required.length} uploaded`],
  ];
  return (
    <section>
      <h2 className="text-xl font-bold">Review & submit</h2>
      <p className="mt-1 text-sm text-slate-500">Check your details before you confirm submission.</p>
      <dl className="mt-5 grid gap-3 sm:grid-cols-2">{rows.map(([label, value]) => <div key={label} className="rounded-xl bg-slate-50 p-3"><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-1 break-words text-sm font-semibold">{value || "—"}</dd></div>)}</dl>
    </section>
  );
}
