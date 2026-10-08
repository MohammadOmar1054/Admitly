"use client";

import StudentApplyPage from "@/app/student/apply/page";

export interface ApplicationWizardProps {
  className?: string;
}

/** Reusable entry point for the complete application flow used by the Apply route. */
export function ApplicationWizard({ className }: ApplicationWizardProps) {
  return <div className={className}><StudentApplyPage /></div>;
}
