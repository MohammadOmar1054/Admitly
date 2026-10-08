"use client";

import type {
  AnalyticsSummary,
  Application,
  ApplicationStatus,
  DocumentType,
  User,
} from "@/types";
import { seedApplications, seedUsers } from "./mock-data";
import { generateId } from "./utils";
import { DOCUMENT_META } from "./constants";

const keys = {
  users: "oams_users",
  apps: "oams_apps",
  session: "oams_session",
};

const wait = () => new Promise<void>((resolve) => setTimeout(resolve, 300));

const read = <T,>(key: string, seed: T): T => {
  if (typeof window === "undefined") return seed;
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
    localStorage.setItem(key, JSON.stringify(seed));
  } catch {
    return seed;
  }
  return seed;
};

const write = <T,>(key: string, value: T) =>
  localStorage.setItem(key, JSON.stringify(value));
const apps = () => read<Application[]>(keys.apps, seedApplications);
const event = (status: ApplicationStatus, label: string, note?: string) => ({
  id: crypto.randomUUID(),
  status,
  label,
  ...(note ? { note } : {}),
  at: new Date().toISOString(),
});

export async function login(email: string, password: string) {
  await wait();
  const user = read<User[]>(keys.users, seedUsers).find(
    (candidate) => candidate.email === email && candidate.password === password,
  );
  if (!user) throw new Error("Incorrect email or password");
  write(keys.session, user);
  return user;
}

export async function register(name: string, email: string, password: string) {
  await wait();
  const users = read<User[]>(keys.users, seedUsers);
  if (users.some((user) => user.email === email)) {
    throw new Error("This email is already registered");
  }
  const user: User = {
    id: crypto.randomUUID(),
    name,
    email,
    password,
    role: "student",
    avatarColor: "#4f46e5",
  };
  write(keys.users, [...users, user]);
  write(keys.session, user);
  return user;
}

export async function logout() {
  await wait();
  localStorage.removeItem(keys.session);
}

export async function getCurrentUser() {
  await wait();
  return typeof window === "undefined" ? null : read<User | null>(keys.session, null);
}

export async function getApplications() {
  await wait();
  return apps();
}

export async function getApplicationById(id: string) {
  await wait();
  return apps().find((application) => application.id === id) ?? null;
}

export async function getApplicationByUser(userId: string) {
  await wait();
  return apps().find((application) => application.userId === userId) ?? null;
}

export async function saveDraft(userId: string, partial: Partial<Application>) {
  await wait();
  const all = apps();
  let application = all.find((candidate) => candidate.userId === userId);
  if (!application) {
    const user = read<User[]>(keys.users, seedUsers).find((candidate) => candidate.id === userId);
    if (!user) throw new Error("Student account not found");
    const now = new Date().toISOString();
    application = {
      id: generateId(),
      userId,
      status: "draft",
      personal: {
        fullName: user.name,
        email: user.email,
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
    all.push(application);
  }
  Object.assign(application, partial, { updatedAt: new Date().toISOString() });
  write(keys.apps, all);
  return application;
}

export async function submitApplication(userId: string) {
  const application = await saveDraft(userId, {});
  return updateStatus(application.id, "submitted");
}

async function mutate(id: string, update: (application: Application) => void) {
  await wait();
  const all = apps();
  const application = all.find((candidate) => candidate.id === id);
  if (!application) throw new Error("Application not found");
  update(application);
  application.updatedAt = new Date().toISOString();
  write(keys.apps, all);
  return application;
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
    if (existing) Object.assign(existing, next, { rejectionReason: undefined });
    else application.documents.push(next);
    application.timeline.push(event(application.status, `Uploaded ${type.replaceAll("_", " ")}`));
  });
}

export async function verifyDocument(id: string, type: DocumentType) {
  return mutate(id, (application) => {
    const document = application.documents.find((candidate) => candidate.type === type);
    if (!document) throw new Error("Document not found");
    document.status = "verified";
    document.rejectionReason = undefined;
    application.timeline.push(event(application.status, `Verified ${type.replaceAll("_", " ")}`));
  });
}

export async function rejectDocument(id: string, type: DocumentType, reason: string) {
  if (!reason.trim()) throw new Error("A revision reason is required");
  return mutate(id, (application) => {
    const document = application.documents.find((candidate) => candidate.type === type);
    if (!document) throw new Error("Document not found");
    Object.assign(document, { status: "rejected" as const, rejectionReason: reason });
    application.timeline.push(event("documents_pending", "Document revision requested", reason));
    application.status = "documents_pending";
  });
}

export async function updateStatus(
  id: string,
  status: ApplicationStatus,
  remarks?: string,
) {
  if (status === "accepted") {
    const application = apps().find((candidate) => candidate.id === id);
    const requiredTypes = Object.entries(DOCUMENT_META).filter(([, meta]) => meta.required).map(([type]) => type);
    const complete = application && requiredTypes.every((type) => application.documents.some((document) => document.type === type && document.status === "verified"));
    if (!complete) throw new Error("All required documents must be verified before acceptance");
  }
  return mutate(id, (application) => {
    application.status = status;
    application.adminRemarks = remarks || application.adminRemarks;
    if (status === "submitted") application.submittedAt = new Date().toISOString();
    application.timeline.push(event(status, `Application ${status.replaceAll("_", " ")}`));
  });
}

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
    if (application.courses.firstChoice) {
      byCourse[application.courses.firstChoice] =
        (byCourse[application.courses.firstChoice] ?? 0) + 1;
    }
  });
  const reviewed = all.filter((application) => application.submittedAt);
  const reviewDays = reviewed.map((application) => {
    const end = application.status === "accepted" || application.status === "rejected"
      ? new Date(application.updatedAt)
      : new Date();
    return Math.max(0, (end.getTime() - new Date(application.submittedAt!).getTime()) / 86_400_000);
  });
  return {
    total: all.length,
    byStatus,
    byCourse,
    acceptanceRate: all.length ? Math.round((byStatus.accepted / all.length) * 100) : 0,
    averagePercentage: all.length
      ? Math.round(all.reduce((sum, application) => sum + application.academic.percentage12, 0) / all.length)
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

export async function resetDemoData() {
  await wait();
  write(keys.users, seedUsers);
  write(keys.apps, seedApplications);
  localStorage.removeItem(keys.session);
}
