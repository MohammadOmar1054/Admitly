"use client";

import { useRouter } from "next/navigation";
import { useApplications } from "@/context/ApplicationsContext";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { StepIndicator } from "./StepIndicator";

export interface ApplicationWizardProps {
  className?: string;
}

export function ApplicationWizard({ className }: ApplicationWizardProps) {
  const { application } = useApplications();
  const router = useRouter();
  if (application && application.status !== "draft") {
    return <EmptyState className={className} title="Application submitted" description={`Application ${application.id} is now read-only. Follow updates in your status timeline.`} action={<Button onClick={() => router.push("/student/status")}>Open status timeline</Button>} />;
  }
  return <div className={className}><StepIndicator steps={["Personal", "Academics", "Course", "Documents", "Review"]} activeStep={0} /><p className="mt-4 text-sm text-slate-500">Your application wizard is available from the Apply page.</p><Button className="mt-4" onClick={() => router.push("/student/apply")}>Continue application</Button></div>;
}
