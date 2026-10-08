"use client";

import { useMemo, useState } from "react";
import { Users } from "lucide-react";
import type { ApplicationStatus } from "@/types";
import { useApplications } from "@/context/ApplicationsContext";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { FilterBar } from "@/components/admin/FilterBar";
import { ApplicationsTable } from "@/components/admin/ApplicationsTable";

export default function AdminApplicationsPage() {
  const { applications, loading } = useApplications();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [course, setCourse] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    const result = applications.filter((application) => {
      const searchable = `${application.personal.fullName} ${application.id} ${application.personal.email}`.toLowerCase();
      const matchesQuery = searchable.includes(query.toLowerCase());
      const matchesStatus = status === "all" || application.status === (status as ApplicationStatus);
      const matchesCourse = course === "all" || application.courses.firstChoice === course;
      return matchesQuery && matchesStatus && matchesCourse;
    });
    result.sort((first, second) => {
      if (sort === "oldest") return first.createdAt.localeCompare(second.createdAt);
      if (sort === "name") return first.personal.fullName.localeCompare(second.personal.fullName);
      return second.createdAt.localeCompare(first.createdAt);
    });
    return result;
  }, [applications, course, query, sort, status]);

  const changeFilter = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };
  const clear = () => {
    setQuery("");
    setStatus("all");
    setCourse("all");
    setSort("newest");
    setPage(1);
  };

  if (loading) return <div className="space-y-4"><Skeleton className="h-12" /><Skeleton className="h-20" /><Skeleton className="h-96" /></div>;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold text-brand-600">ADMISSIONS DESK</p><h1 className="mt-2 text-3xl font-bold">Applications</h1><p className="mt-2 text-slate-500">Search, filter and review every application.</p></div><span className="rounded-xl bg-white px-4 py-3 text-sm shadow-sm"><b>{filtered.length}</b> <span className="text-slate-500">matching records</span></span></div>
      <div className="mt-6"><FilterBar query={query} status={status} course={course} sort={sort} onQueryChange={changeFilter(setQuery)} onStatusChange={changeFilter(setStatus)} onCourseChange={changeFilter(setCourse)} onSortChange={changeFilter(setSort)} onClear={clear} /></div>
      {filtered.length === 0 ? <EmptyState className="mt-6" title="No applications found" description="Try another search or clear the filters." icon={Users} /> : <ApplicationsTable applications={filtered.slice((page - 1) * pageSize, page * pageSize)} page={page} pageSize={pageSize} total={filtered.length} onPageChange={setPage} />}
    </div>
  );
}
