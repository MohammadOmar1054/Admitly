"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { COURSES, STATUS_META } from "@/lib/constants";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export interface FilterBarProps {
  query: string;
  status: string;
  course: string;
  sort: string;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onCourseChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onClear: () => void;
}

export function FilterBar({ query, status, course, sort, onQueryChange, onStatusChange, onCourseChange, onSortChange, onClear }: FilterBarProps) {
  return <Card><div className="flex items-center gap-2 text-sm font-bold"><SlidersHorizontal size={16} />Filters</div><div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><label className="relative block"><Search className="absolute left-3 top-3.5 text-slate-400" size={16} /><Input aria-label="Search applications" placeholder="Name, ID, or email" value={query} onChange={(event) => onQueryChange(event.target.value)} className="pl-9" /></label><select aria-label="Filter by status" value={status} onChange={(event) => onStatusChange(event.target.value)} className="focus rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"><option value="all">All statuses</option>{Object.entries(STATUS_META).map(([key, meta]) => <option key={key} value={key}>{meta.label}</option>)}</select><select aria-label="Filter by course" value={course} onChange={(event) => onCourseChange(event.target.value)} className="focus rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"><option value="all">All courses</option>{COURSES.map((item) => <option key={item.code} value={item.name}>{item.name}</option>)}</select><select aria-label="Sort applications" value={sort} onChange={(event) => onSortChange(event.target.value)} className="focus rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="name">Applicant name</option></select></div><button type="button" onClick={onClear} className="mt-3 text-xs font-semibold text-brand-700">Clear filters</button></Card>;
}
