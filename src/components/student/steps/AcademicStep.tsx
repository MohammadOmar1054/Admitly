"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { BOARDS, STREAMS } from "@/lib/constants";
import type { AcademicDetails } from "@/types";

export interface AcademicStepProps {
  value: AcademicDetails;
  errors: Record<string, string>;
  onChange: <K extends keyof AcademicDetails>(field: K, value: AcademicDetails[K]) => void;
}

export function AcademicStep({ value, errors, onChange }: AcademicStepProps) {
  return <section><h2 className="text-xl font-bold">Academic history</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><Select label="Class 10 board" name="board10" value={value.board10} options={BOARDS.map((board) => ({ value: board, label: board }))} onChange={(event) => onChange("board10", event.target.value)} /><Input label="Class 10 percentage" name="percentage10" type="number" min="0" max="100" value={value.percentage10 || ""} error={errors.percentage10} onChange={(event) => onChange("percentage10", Number(event.target.value))} /><Select label="Class 12 board" name="board12" value={value.board12} options={BOARDS.map((board) => ({ value: board, label: board }))} onChange={(event) => onChange("board12", event.target.value)} /><Select label="Class 12 stream" name="stream12" value={value.stream12} options={STREAMS.map((stream) => ({ value: stream, label: stream }))} onChange={(event) => onChange("stream12", event.target.value)} /><Input label="Class 12 percentage" name="percentage12" type="number" min="0" max="100" value={value.percentage12 || ""} error={errors.percentage12} onChange={(event) => onChange("percentage12", Number(event.target.value))} /><Input label="School name" name="schoolName" value={value.schoolName} error={errors.schoolName} onChange={(event) => onChange("schoolName", event.target.value)} /></div></section>;
}
