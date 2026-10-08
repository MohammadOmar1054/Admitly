"use client";

import { COURSES } from "@/lib/constants";

export interface CourseStepProps {
  value: string;
  percentage: number;
  error?: string;
  onChange: (course: string) => void;
}

export function CourseStep({ value, percentage, error, onChange }: CourseStepProps) {
  return <section><h2 className="text-xl font-bold">Choose your course</h2>{error && <p className="mt-2 text-sm text-rose-600">{error}</p>}<div className="mt-5 grid gap-3 sm:grid-cols-2">{COURSES.map((course) => <button type="button" key={course.code} onClick={() => onChange(course.name)} className={`rounded-xl border p-4 text-left ${value === course.name ? "border-brand-500 bg-brand-50" : "border-slate-200"}`}><b>{course.name}</b><p className="mt-2 text-xs text-slate-500">{course.seats} seats · {course.duration}</p><p className="mt-1 text-xs">Minimum {course.minPercentage}% · {percentage >= course.minPercentage ? "Eligible" : "Below requirement"}</p></button>)}</div></section>;
}
