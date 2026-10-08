"use client";

import type {
  AnalyticsSummary,
  Application,
  ApplicationStatus,
  DocumentType,
  User,
} from "@/types";
import { supabase } from "./supabase";
import { generateId } from "./utils";
import { DOCUMENT_META } from "./constants";

/* ------------------------------------------------------------------ *
 * Supabase-backed data layer. Function names/signatures are identical
 * to the old localStorage version, so no page or context changes.
 * ------------------------------------------------------------------ */

interface ProfileRow {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  avatar_color: string;
}

interface ApplicationRow {
  id: string;
  user_id: string;
  status: ApplicationStatus;
  personal: Application["personal"];
  academic: Application["academic"];
  courses: Application["courses"];
  documents: Application["documents"];
  timeline: Application["timeline"];
  admin_remarks: string | null;
  created_at: string;
  updated_at: string;
  submitted_at: string | null;
}

const toUser = (row: ProfileRow): User => ({
  id: row.id,
  name: row.name,
  email: row.email,
  password: "", // never exposed by Supabase
  role: row.role,
  avatarColor: row.avatar_color,
});

const toApplication = (row: ApplicationRow): Application => ({
  id: row.id,
  userId: row.user_id,
  status: row.status,
  personal: row.personal,
  academic: row.academic,
  courses: row.courses,
  documents: row.documents ?? [],
  timeline: row.timeline ?? [],
  adminRemarks: row.admin_remarks ?? undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  submittedAt: row.submitted_at ?? undefined,
});

const event = (status: ApplicationStatus, label: string, note?: string) => ({
  id: crypto.randomUUID(),
  status,
  label,
  ...(note ? { note } : {}),
  at: new Date().toISOString(),
});

async function fetchProfile(userId: string): Promise<User> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error || !data) throw new Error("Profile not found. Please try again.");
  return toUser(data as ProfileRow);
}

/* ------------------------------ AUTH ------------------------------ */

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error || !data.user) throw new Error("Incorrect email or password");
  return fetchProfile(data.user.id);
}

export async function register(name: string, email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: { data: { name } },
  });
  if (error) {
    if (/already/i.test(error.message)) throw new Error("This email is already registered");
    throw new Error(error.message);
  }
  if (!data.user) throw new Error("Could not create the account");
  if (!data.session) {
    throw new Error(
      "Account created. Please confirm your email, then log in. (Tip: disable 'Confirm email' in Supabase for instant sign-up.)",
    );
  }
  return fetchProfile(data.user.id);
}

export async function logout() {
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getSession();
  if (!data.session) return null;
  try {
    return await fetchProfile(data.session.user.id);
  } catch {
    return null;
  }
}

/* --------------------------- APPLICATIONS --------------------------- */

export async function getApplications() {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as ApplicationRow[]).map(toApplication);
}

export async function getApplicationById(id: string) {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? toApplication(data as ApplicationRow) : null;
}

export async function getApplicationByUser(userId: string) {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? toApplication(data as ApplicationRow) : null;
}

const toPatch = (partial: Partial<Application>) => {
  const patch: Record<string, unknown> = {};
  if (partial.status !== undefined) patch.status = partial.status;
  if (partial.personal !== undefined) patch.personal = partial.personal;
  if (partial.academic !== undefined) patch.academic = partial.academic;
  if (partial.courses !== undefined) patch.courses = partial.courses;
  if (partial.documents !== undefined) patch.documents = partial.documents;
  if (partial.timeline !== undefined) patch.timeline = partial.timeline;
  if (partial.adminRemarks !== undefined) patch.admin_remarks = partial.adminRemarks;
  if (partial.submittedAt !== undefined) patch.submitted_at = partial.submittedAt;
  patch.updated_at = new Date().toISOString();
  return patch;
};

export async function saveDraft(userId: string, partial: Partial<Application>) {
  const existing = await getApplicationByUser(userId);

  if (existing) {
    const { data, error } = await supabase
      .from("applications")
      .update(toPatch(partial))
      .eq("id", existing.id)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return toApplication(data as ApplicationRow);
  }

  const profile = await fetchProfile(userId);
  const now = new Date().toISOString();
  const base: Application = {
    id: generateId(),
    userId,
    status: "draft",
    personal: {
      fullName: profile.name,
      email: profile.email,
      phone: "",
      dob: "",
      gender: "male",
      address: "",
      city: "",
      state: "",
      pincode: "",
      guardianName: "",
      guardianPhone: "",
    },
    academic: {
      board10: "",
      percentage10: 0,
      year10: 2023,
      board12: "",
      stream12: "",
      percentage12: 0,
      year12: 2025,
      schoolName: "",
    },
    courses: { firstChoice: "" },
    documents: [],
    timeline: [event("draft", "Draft created")],
    createdAt: now,
    updatedAt: now,
  };
  const merged: Application = { ...base, ...partial, id: base.id, userId, status: "draft" };

  // generateId() is random, so retry on the rare id collision
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const id = attempt === 0 ? merged.id : generateId();
    const { data, error } = await supabase
      .from("applications")
      .insert({
        id,
        user_id: userId,
        status: "draft",
        personal: merged.personal,
        academic: merged.academic,
        courses: merged.courses,
        documents: merged.documents,
        timeline: merged.timeline,
      })
      .select("*")
      .single();
    if (!error && data) return toApplication(data as ApplicationRow);
    if (error?.code !== "23505") throw new Error(error?.message ?? "Could not save draft");
    // 23505 on user_id means a draft already exists (double-click); reuse it
    const again = await getApplicationByUser(userId);
    if (again) return again;
  }
  throw new Error("Could not generate a unique application ID");
}

export async function submitApplication(userId: string) {
  const application = await saveDraft(userId, {});
  return updateStatus(application.id, "submitted");
}

async function mutate(id: string, update: (application: Application) => void) {
  const current = await getApplicationById(id);
  if (!current) throw new Error("Application not found");
  const next: Application = structuredClone(current);
  update(next);
  const { data, error } = await supabase
    .from("applications")
    .update({
      status: next.status,
      documents: next.documents,
      timeline: next.timeline,
      admin_remarks: next.adminRemarks ?? null,
      submitted_at: next.submittedAt ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return toApplication(data as ApplicationRow);
}

export async function uploadDocument(
  id: string,
  type: DocumentType,
  file: { name: string; size: number },
) {
  return mutate(id, (application) => {
    const existing = application.documents.find((document) => document.type === type);
    const next = {
      type,
      status: "uploaded" as const,
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
    };
    if (existing) {
      Object.assign(existing, next);
      delete existing.rejectionReason;
    } else {
      application.documents.push(next);
    }
    application.timeline.push(
      event(application.status, `Uploaded ${type.replaceAll("_", " ")}`),
    );
  });
}

export async function verifyDocument(id: string, type: DocumentType) {
  return mutate(id, (application) => {
    const document = application.documents.find((candidate) => candidate.type === type);
    if (!document) throw new Error("Document not found");
    document.status = "verified";
    delete document.rejectionReason;
    application.timeline.push(
      event(application.status, `Verified ${type.replaceAll("_", " ")}`),
    );
  });
}

export async function rejectDocument(id: string, type: DocumentType, reason: string) {
  if (!reason.trim()) throw new Error("A revision reason is required");
  return mutate(id, (application) => {
    const document = application.documents.find((candidate) => candidate.type === type);
    if (!document) throw new Error("Document not found");
    Object.assign(document, { status: "rejected" as const, rejectionReason: reason });
    application.status = "documents_pending";
    application.timeline.push(
      event("documents_pending", "Document revision requested", reason),
    );
  });
}

export async function updateStatus(
  id: string,
  status: ApplicationStatus,
  remarks?: string,
) {
  if (status === "accepted") {
    const application = await getApplicationById(id);
    const requiredTypes = Object.entries(DOCUMENT_META)
      .filter(([, meta]) => meta.required)
      .map(([type]) => type);
    const complete =
      application &&
      requiredTypes.every((type) =>
        application.documents.some(
          (document) => document.type === type && document.status === "verified",
        ),
      );
    if (!complete) {
      throw new Error("All required documents must be verified before acceptance");
    }
  }
  return mutate(id, (application) => {
    application.status = status;
    application.adminRemarks = remarks || application.adminRemarks;
    if (status === "submitted") application.submittedAt = new Date().toISOString();
    application.timeline.push(
      event(status, `Application ${status.replaceAll("_", " ")}`),
    );
  });
}

/* ----------------------------- ANALYTICS ---------------------------- */

export async function getAnalytics(): Promise<AnalyticsSummary> {
  const all = await getApplications();
  const byStatus: Record<ApplicationStatus, number> = {
    draft: 0,
    submitted: 0,
    under_review: 0,
    documents_pending: 0,
    accepted: 0,
    rejected: 0,
  };
  const byCourse: Record<string, number> = {};
  all.forEach((application) => {
    byStatus[application.status] += 1;
    const course = application.courses.firstChoice;
    if (course) byCourse[course] = (byCourse[course] ?? 0) + 1;
  });
  const reviewed = all.filter((application) => application.submittedAt);
  const reviewDays = reviewed.map((application) => {
    const end =
      application.status === "accepted" || application.status === "rejected"
        ? new Date(application.updatedAt)
        : new Date();
    return Math.max(
      0,
      (end.getTime() - new Date(application.submittedAt!).getTime()) / 86_400_000,
    );
  });
  return {
    total: all.length,
    byStatus,
    byCourse,
    acceptanceRate: all.length ? Math.round((byStatus.accepted / all.length) * 100) : 0,
    averagePercentage: all.length
      ? Math.round(
          all.reduce((sum, application) => sum + (application.academic.percentage12 ?? 0), 0) /
            all.length,
        )
      : 0,
    weeklySubmissions: Array.from({ length: 7 }, (_, index) => {
      const day = new Date();
      day.setDate(day.getDate() - (6 - index));
      day.setHours(0, 0, 0, 0);
      return all.filter((application) => {
        if (!application.submittedAt) return false;
        const submitted = new Date(application.submittedAt);
        return submitted >= day && submitted < new Date(day.getTime() + 86_400_000);
      }).length;
    }),
    averageReviewDays: reviewDays.length
      ? Math.round((reviewDays.reduce((sum, days) => sum + days, 0) / reviewDays.length) * 10) / 10
      : 0,
  };
}

/** Kept for API compatibility. Real data lives in Supabase now. */
export async function resetDemoData() {
  await logout();
}