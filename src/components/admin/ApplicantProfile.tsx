import type { Application } from "@/types";

export interface ApplicantProfileProps {
  application: Application;
}

export function ApplicantProfile({ application }: ApplicantProfileProps) {
  const rows = [
    ["Email", application.personal.email],
    ["Phone", application.personal.phone],
    ["Date of birth", application.personal.dob],
    ["School", application.academic.schoolName],
    ["Class 10", `${application.academic.board10} · ${application.academic.percentage10}%`],
    ["Class 12", `${application.academic.board12} · ${application.academic.percentage12}%`],
    ["First choice", application.courses.firstChoice],
  ];
  return <dl className="grid gap-4 sm:grid-cols-2">{rows.map(([label, value]) => <div key={label}><dt className="text-xs text-slate-400">{label}</dt><dd className="mt-1 text-sm font-medium">{value || "—"}</dd></div>)}</dl>;
}
