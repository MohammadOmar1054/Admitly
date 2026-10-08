"use client";

import type { ApplicationStatus } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export interface DecisionPanelProps {
  verifiedRequired: boolean;
  onDecision: (status: ApplicationStatus) => void;
}

export function DecisionPanel({ verifiedRequired, onDecision }: DecisionPanelProps) {
  return <Card><h2 className="font-bold">Decision panel</h2><p className="mt-2 text-sm text-slate-500">Review required files before deciding.</p><div className="mt-4 space-y-2"><Button variant="secondary" className="w-full" onClick={() => onDecision("under_review")}>Move to review</Button><Button variant="secondary" className="w-full" onClick={() => onDecision("documents_pending")}>Request documents</Button><Button className="w-full" disabled={!verifiedRequired} onClick={() => onDecision("accepted")}>Accept application</Button><Button variant="danger" className="w-full" onClick={() => onDecision("rejected")}>Reject application</Button></div>{!verifiedRequired && <p className="mt-3 text-xs text-amber-700">Accept is available after all required documents are verified.</p>}</Card>;
}
