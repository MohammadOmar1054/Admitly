import type { Application, ApplicationDocument, ApplicationStatus, User } from "@/types";
import { COURSES, DOCUMENT_META } from "./constants";

const now = new Date();
const iso = (days: number) => new Date(now.getTime() - days * 86_400_000).toISOString();

export const seedUsers: User[] = [
  {
    id: "student-1",
    name: "Aarav Sharma",
    email: "student@demo.com",
    password: "student123",
    role: "student",
    avatarColor: "#4f46e5",
  },
  {
    id: "admin-1",
    name: "Admissions Office",
    email: "admin@demo.com",
    password: "admin123",
    role: "admin",
    avatarColor: "#f59e0b",
  },
];

const documents = (demo = false): ApplicationDocument[] =>
  Object.keys(DOCUMENT_META).map((type, index) => ({
    type: type as ApplicationDocument["type"],
    status: demo
      ? index < 4
        ? "verified"
        : index === 4
          ? "uploaded"
          : "rejected"
      : index < 4
        ? "verified"
        : "uploaded",
    fileName: `document-${index + 1}.pdf`,
    fileSize: 240_000,
    uploadedAt: iso(15),
    ...(demo && index === 5
      ? { rejectionReason: "Image is blurry, please re-upload a clear scan" }
      : {}),
  }));

const make = (
  index: number,
  status: ApplicationStatus,
  userId = `seed-${index}`,
): Application => {
  const names = ["Priya Nair", "Rohan Gupta", "Ananya Patel", "Kabir Singh", "Isha Verma", "Vikram Rao"];
  const name = names[index % names.length];
  const created = iso(60 - index * 2);
  return {
    id: `ADM-2026-${String(index + 1).padStart(4, "0")}`,
    userId,
  status,
    personal: {
      fullName: name,
      email: `${name.toLowerCase().replace(" ", ".")}@mail.com`,
      phone: "9876543210",
      dob: "2007-04-14",
      gender: index % 2 === 0 ? "female" : "male",
      address: "21 College Road",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001",
      guardianName: "Parent",
      guardianPhone: "9876543211",
    },
    academic: {
      board10: "CBSE",
      percentage10: 78 + (index % 18),
      year10: 2023,
      board12: "CBSE",
      stream12: "Science",
      percentage12: 65 + (index % 30),
      year12: 2025,
      schoolName: "Central Public School",
    },
    courses: {
      firstChoice: COURSES[index % COURSES.length].name,
      secondChoice: COURSES[(index + 1) % COURSES.length].name,
    },
    documents: documents(),
    timeline: [
      {
        id: `e${index}`,
        label: status === "draft" ? "Draft created" : "Application submitted",
        at: created,
        status: status === "draft" ? "draft" : "submitted",
      },
      {
        id: `r${index}`,
        label: status.replaceAll("_", " "),
        at: iso(index),
        status,
      },
    ],
    createdAt: created,
    updatedAt: iso(index),
    submittedAt: status === "draft" ? undefined : created,
  };
};

const statuses: ApplicationStatus[] = [
  "submitted",
  "submitted",
  "submitted",
  "submitted",
  "submitted",
  "under_review",
  "under_review",
  "under_review",
  "under_review",
  "under_review",
  "documents_pending",
  "documents_pending",
  "documents_pending",
  "documents_pending",
  "accepted",
  "accepted",
  "accepted",
  "accepted",
  "accepted",
  "rejected",
  "rejected",
  "rejected",
  "draft",
  "under_review",
];

export const seedApplications: Application[] = [
  {
    ...make(0, "under_review", "student-1"),
    personal: {
      ...make(0, "under_review").personal,
      fullName: "Aarav Sharma",
      email: "student@demo.com",
    },
    documents: documents(true),
    adminRemarks: "Your application is being reviewed by our admissions team.",
  },
  ...statuses.map((status, index) => make(index + 1, status)),
];
