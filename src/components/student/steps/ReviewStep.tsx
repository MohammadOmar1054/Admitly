import type { AcademicDetails, PersonalDetails } from "@/types";

export interface ReviewStepProps {
  personal: PersonalDetails;
  academic: AcademicDetails;
  course: string;
}

export function ReviewStep({ personal, academic, course }: ReviewStepProps) {
  return <section><h2 className="text-xl font-bold">Review & submit</h2><dl className="mt-4 grid gap-3 sm:grid-cols-2">{[["Applicant", personal.fullName], ["Contact", personal.email], ["Phone", personal.phone], ["Class 12", `${academic.board12} · ${academic.percentage12}%`], ["School", academic.schoolName], ["Course", course]].map(([label, value]) => <div key={label} className="rounded-xl bg-slate-50 p-3"><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-1 text-sm font-semibold">{value || "—"}</dd></div>)}</dl></section>;
}
