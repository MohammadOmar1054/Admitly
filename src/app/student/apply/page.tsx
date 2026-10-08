"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, CircleCheck, FileCheck2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useApplications } from "@/context/ApplicationsContext";
import * as api from "@/lib/api";
import { BOARDS, COURSES, DOCUMENT_META, INDIAN_STATES, STREAMS } from "@/lib/constants";
import { validateAcademicDetails, validateEmail, validateMinimumAge, validatePincode, validatePhone, validateRequired } from "@/lib/validators";
import type { AcademicDetails, PersonalDetails } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { Progress } from "@/components/ui/Progress";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/context/ToastContext";
import { useReducedMotion } from "framer-motion";

const steps = ["Personal", "Academics", "Course", "Documents", "Review"];

export default function StudentApplyPage() {
  const { user } = useAuth();
  const { application, loading, refresh } = useApplications();
  const { toast } = useToast();
  const reducedMotion = useReducedMotion();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [personal, setPersonal] = useState<PersonalDetails>({ fullName: user?.name ?? "", email: user?.email ?? "", phone: "", dob: "", gender: "male", address: "", city: "", state: "", pincode: "", guardianName: "", guardianPhone: "" });
  const [academic, setAcademic] = useState<AcademicDetails>({ board10: "CBSE", percentage10: 0, year10: 2023, board12: "CBSE", stream12: "Science", percentage12: 0, year12: 2025, schoolName: "" });
  const [course, setCourse] = useState("");

  useEffect(() => {
    if (user && !application) {
      setPersonal((current) => ({ ...current, fullName: user.name, email: user.email }));
    }
  }, [application, user]);

  useEffect(() => {
    if (!application) return;
    setPersonal(application.personal);
    setAcademic(application.academic);
    setCourse(application.courses.firstChoice);
  }, [application]);

  const submitted = Boolean(application && application.status !== "draft");
  const documents = useMemo(() => application?.documents ?? [], [application]);

  const save = async () => {
    if (!user) return;
    setBusy(true);
    try {
      await api.saveDraft(user.id, { personal, academic, courses: { ...application?.courses, firstChoice: course } });
      await refresh();
      setSaved(true);
      toast.success("Draft saved");
      window.setTimeout(() => setSaved(false), 1800);
    } finally {
      setBusy(false);
    }
  };

  const validateStep = () => {
    let next: Record<string, string> = {};
    if (step === 0) {
      next = validateRequired(personal as unknown as Record<string, string | number>, ["fullName", "email", "phone", "dob", "address", "city", "state", "pincode", "guardianName", "guardianPhone"]);
      const phoneError = validatePhone(personal.phone);
      const emailError = validateEmail(personal.email);
      const guardianError = validatePhone(personal.guardianPhone);
      const pinError = validatePincode(personal.pincode);
      const ageError = validateMinimumAge(personal.dob);
      if (phoneError) next.phone = phoneError;
      if (emailError) next.email = emailError;
      if (guardianError) next.guardianPhone = guardianError;
      if (pinError) next.pincode = pinError;
      if (ageError) next.dob = ageError;
    }
    if (step === 1) {
      next = validateAcademicDetails(academic);
      if (!academic.percentage10) next.percentage10 = "Enter your Class 10 percentage.";
      if (!academic.percentage12) next.percentage12 = "Enter your Class 12 percentage.";
      if (!academic.year10 || academic.year10 < 1950 || academic.year10 > new Date().getFullYear()) next.year10 = "Enter a valid passing year.";
      if (!academic.year12 || academic.year12 < 1950 || academic.year12 > new Date().getFullYear()) next.year12 = "Enter a valid passing year.";
    }
    if (step === 2 && !course) next.firstChoice = "Choose a course to continue.";
    if (step === 3) {
      const required = Object.entries(DOCUMENT_META).filter(([, meta]) => meta.required);
      const missing = required.filter(([type]) => !documents.some((document) => document.type === type && (document.status === "uploaded" || document.status === "verified")));
      if (missing.length) next.documents = `Upload each required document before continuing (${missing.length} remaining).`;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const advance = async (event: FormEvent) => {
    event.preventDefault();
    if (!validateStep()) return;
    await save();
    setStep((current) => Math.min(4, current + 1));
  };

  const submit = async () => {
    if (!user) return;
    setBusy(true);
    setSubmitError("");
    try {
      await api.saveDraft(user.id, { personal, academic, courses: { ...application?.courses, firstChoice: course } });
      const latest = await api.getApplicationByUser(user.id);
      if (!latest || !latest.courses.firstChoice) throw new Error("Choose a course before submitting your application.");
      const hasValidProfile = Boolean(latest.personal.fullName && latest.personal.email && latest.personal.phone && latest.personal.dob && latest.personal.address && latest.personal.city && latest.personal.state && latest.personal.pincode && latest.personal.guardianName && latest.personal.guardianPhone);
      if (!hasValidProfile) throw new Error("Complete your personal details before submitting your application.");
      const academicErrors = validateAcademicDetails(latest.academic);
      if (!latest.academic.percentage10 || !latest.academic.percentage12 || Object.keys(academicErrors).length) throw new Error("Complete your academic details before submitting your application.");
      const requiredTypes = Object.entries(DOCUMENT_META).filter(([, meta]) => meta.required).map(([type]) => type);
      const complete = requiredTypes.every((type) => latest.documents.some((document) => document.type === type && (document.status === "uploaded" || document.status === "verified")));
      if (!complete) throw new Error("Upload all required documents before submitting your application.");
      await api.submitApplication(user.id);
      await refresh();
      setConfirm(false);
    } catch (cause) {
      setSubmitError(cause instanceof Error ? cause.message : "Could not submit your application.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="space-y-4"><Skeleton className="h-12" /><Skeleton className="h-3" /><Skeleton className="h-[500px]" /></div>;
  if (submitted) return <EmptyState title="Application submitted" description={`Your application ${application?.id} is read-only while it is being reviewed. Track its progress and any requests from admissions.`} icon={CircleCheck} action={<Button onClick={() => router.push("/student/status")}>View application status <ArrowRight className="ml-2 inline" size={16} /></Button>} />;

  const setPersonalField = <K extends keyof PersonalDetails>(key: K, value: PersonalDetails[K]) => setPersonal((current) => ({ ...current, [key]: value }));
  const setAcademicField = <K extends keyof AcademicDetails>(key: K, value: AcademicDetails[K]) => setAcademic((current) => ({ ...current, [key]: value }));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-semibold text-brand-600">APPLICATION WIZARD</p><h1 className="mt-2 text-3xl font-bold">Your application</h1><p className="mt-2 text-slate-500">Five clear steps. Your draft saves as you go.</p></div><p className="text-xs text-slate-500">{saved ? <span className="text-emerald-700"><Check size={14} className="mr-1 inline" />Draft saved</span> : busy ? "Saving draft…" : "Draft saved locally"}</p></div>
      <div className="mt-7 grid grid-cols-5 gap-2">{steps.map((label, index) => <button key={label} type="button" onClick={() => index < step && setStep(index)} className="text-left disabled:cursor-default" disabled={index > step}><span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${index < step ? "bg-emerald-100 text-emerald-700" : index === step ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-400"}`}>{index < step ? <Check size={15} /> : index + 1}</span><span className={`mt-2 hidden text-xs font-semibold sm:block ${index === step ? "text-brand-700" : "text-slate-400"}`}>{label}</span></button>)}</div>
      <Progress className="mt-4" value={step * 25} label={`Step ${step + 1} of 5`} />
      <form onSubmit={advance} className="mt-6"><Card><AnimatePresence mode="wait"><motion.div key={step} initial={reducedMotion ? false : { opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={reducedMotion ? undefined : { opacity: 0, x: -12 }} transition={{ duration: reducedMotion ? 0 : .25 }}>
        {step === 0 && <section><h2 className="text-xl font-bold">Personal details</h2><p className="mt-1 text-sm text-slate-500">Tell us how to contact you and your guardian.</p><div className="mt-5 grid gap-4 sm:grid-cols-2"><Input label="Full name" name="fullName" value={personal.fullName} error={errors.fullName} onChange={(event) => setPersonalField("fullName", event.target.value)} /><Input label="Email address" name="email" type="email" value={personal.email} error={errors.email} onChange={(event) => setPersonalField("email", event.target.value)} /><Input label="Phone number" name="phone" inputMode="numeric" value={personal.phone} error={errors.phone} onChange={(event) => setPersonalField("phone", event.target.value)} /><Input label="Date of birth" name="dob" type="date" value={personal.dob} error={errors.dob} onChange={(event) => setPersonalField("dob", event.target.value)} /><Select label="Gender" name="gender" value={personal.gender} options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }, { value: "other", label: "Prefer not to say" }]} onChange={(event) => setPersonalField("gender", event.target.value as PersonalDetails["gender"])} /><Input label="Address" name="address" value={personal.address} error={errors.address} onChange={(event) => setPersonalField("address", event.target.value)} /><Input label="City" name="city" value={personal.city} error={errors.city} onChange={(event) => setPersonalField("city", event.target.value)} /><Select label="State" name="state" value={personal.state} options={[{ value: "", label: "Choose state" }, ...INDIAN_STATES.map((state) => ({ value: state, label: state }))]} onChange={(event) => setPersonalField("state", event.target.value)} /><Input label="Pincode" name="pincode" inputMode="numeric" value={personal.pincode} error={errors.pincode} onChange={(event) => setPersonalField("pincode", event.target.value)} /><Input label="Guardian name" name="guardianName" value={personal.guardianName} error={errors.guardianName} onChange={(event) => setPersonalField("guardianName", event.target.value)} /><Input label="Guardian phone" name="guardianPhone" inputMode="numeric" value={personal.guardianPhone} error={errors.guardianPhone} onChange={(event) => setPersonalField("guardianPhone", event.target.value)} /></div></section>}
        {step === 1 && <section><h2 className="text-xl font-bold">Academic history</h2><p className="mt-1 text-sm text-slate-500">Enter your secondary and higher secondary results.</p><div className="mt-5 grid gap-4 sm:grid-cols-2"><Select label="Class 10 board" name="board10" value={academic.board10} options={BOARDS.map((board) => ({ value: board, label: board }))} onChange={(event) => setAcademicField("board10", event.target.value)} /><Input label="Class 10 percentage" name="percentage10" type="number" min="0" max="100" value={academic.percentage10 || ""} error={errors.percentage10} onChange={(event) => setAcademicField("percentage10", Number(event.target.value))} /><Input label="Class 10 passing year" name="year10" type="number" min="2000" max={new Date().getFullYear()} value={academic.year10} error={errors.year10} onChange={(event) => setAcademicField("year10", Number(event.target.value))} /><Select label="Class 12 board" name="board12" value={academic.board12} options={BOARDS.map((board) => ({ value: board, label: board }))} onChange={(event) => setAcademicField("board12", event.target.value)} /><Select label="Class 12 stream" name="stream12" value={academic.stream12} options={STREAMS.map((stream) => ({ value: stream, label: stream }))} onChange={(event) => setAcademicField("stream12", event.target.value)} /><Input label="Class 12 percentage" name="percentage12" type="number" min="0" max="100" value={academic.percentage12 || ""} error={errors.percentage12} onChange={(event) => setAcademicField("percentage12", Number(event.target.value))} /><Input label="Class 12 passing year" name="year12" type="number" min="2000" max={new Date().getFullYear()} value={academic.year12} error={errors.year12} onChange={(event) => setAcademicField("year12", Number(event.target.value))} /><Input label="School name" name="schoolName" value={academic.schoolName} error={errors.schoolName} onChange={(event) => setAcademicField("schoolName", event.target.value)} /></div></section>}
        {step === 2 && <section><h2 className="text-xl font-bold">Choose your course</h2><p className="mt-1 text-sm text-slate-500">Select your first preference. Eligibility is based on your Class 12 percentage.</p>{errors.firstChoice && <p className="mt-3 text-sm text-rose-600">{errors.firstChoice}</p>}<div className="mt-5 grid gap-3 md:grid-cols-2">{COURSES.map((item) => { const eligible = academic.percentage12 >= item.minPercentage; return <button key={item.code} type="button" onClick={() => setCourse(item.name)} className={`rounded-2xl border p-4 text-left transition ${course === item.name ? "border-brand-500 bg-brand-50 ring-2 ring-brand-100" : "border-slate-200 hover:border-brand-300"}`}><div className="flex items-start justify-between"><div><p className="font-bold">{item.name}</p><p className="mt-1 text-xs text-slate-500">{item.code} · {item.duration}</p></div>{course === item.name && <CheckCircle2 className="text-brand-600" size={19} />}</div><div className="mt-4 flex items-center justify-between text-xs"><span className="text-slate-500">{item.seats} seats available</span><span className={eligible ? "font-semibold text-emerald-700" : "font-semibold text-amber-700"}>Minimum {item.minPercentage}% · {eligible ? "Eligible" : "Not eligible yet"}</span></div></button>; })}</div></section>}
        {step === 3 && <section><h2 className="text-xl font-bold">Supporting documents</h2><p className="mt-1 text-sm text-slate-500">Upload the required files before you review your application.</p>{errors.documents && <p className="mt-3 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{errors.documents}</p>}<div className="mt-5 space-y-3">{Object.entries(DOCUMENT_META).filter(([, meta]) => meta.required).map(([type, meta]) => { const file = documents.find((document) => document.type === type); return <div key={type} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-4"><div className="flex items-center gap-3"><FileCheck2 className="text-brand-600" size={19} /><div><p className="text-sm font-semibold">{meta.label}</p><p className="mt-1 text-xs text-slate-500">{file?.fileName ?? "No file uploaded"}</p></div></div><span className={`rounded-full px-2 py-1 text-xs font-semibold ${file && file.status !== "rejected" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{file?.status ?? "required"}</span></div>; })}</div><a href="/student/documents" className="mt-4 inline-block text-sm font-semibold text-brand-700">Go to documents to upload or replace files →</a></section>}
        {step === 4 && <section><h2 className="text-xl font-bold">Review & submit</h2><p className="mt-1 text-sm text-slate-500">Confirm your details. You can’t edit this application after submission.</p><div className="mt-5 grid gap-4 sm:grid-cols-2"><ReviewBlock title="Personal details" lines={[personal.fullName, personal.email, personal.phone, `${personal.city}, ${personal.state} ${personal.pincode}`]} onEdit={() => setStep(0)} /><ReviewBlock title="Academic details" lines={[personal ? `${academic.board10} · ${academic.percentage10}% (Class 10)` : "", `${academic.board12} · ${academic.percentage12}% (Class 12)`, academic.schoolName]} onEdit={() => setStep(1)} /><ReviewBlock title="Course preference" lines={[course || "No course chosen"]} onEdit={() => setStep(2)} /><ReviewBlock title="Documents" lines={[`${documents.filter((document) => document.status !== "rejected").length} uploaded`]} onEdit={() => setStep(3)} /></div><label className="mt-5 flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm"><input type="checkbox" required className="mt-1 accent-brand-600" /><span>I confirm the information is accurate and complete to the best of my knowledge.</span></label></section>}
      </motion.div></AnimatePresence>
      <div className="mt-7 flex flex-wrap items-center justify-between gap-3"><Button type="button" variant="secondary" disabled={step === 0 || busy} onClick={() => setStep((current) => Math.max(0, current - 1))}><ArrowLeft className="mr-2 inline" size={15} />Back</Button>{step < 4 ? <Button type="submit" disabled={busy}>Save & continue <ArrowRight className="ml-2 inline" size={15} /></Button> : <Button type="button" disabled={busy} onClick={() => setConfirm(true)}>Submit application <Check className="ml-2 inline" size={15} /></Button>}</div>
      </Card></form>
      <Modal open={confirm} onClose={() => setConfirm(false)} title="Submit your application?"><p className="text-sm leading-6 text-slate-600">Your application details will become read-only after submission. You can still respond to document revision requests.</p>{submitError && <p role="alert" className="mt-3 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{submitError}</p>}<div className="mt-6 flex justify-end gap-3"><Button variant="secondary" onClick={() => setConfirm(false)}>Keep reviewing</Button><Button disabled={busy} onClick={() => void submit()}>{busy ? "Submitting…" : "Confirm submission"}</Button></div></Modal>
    </div>
  );
}

interface ReviewBlockProps { title: string; lines: string[]; onEdit: () => void }
function ReviewBlock({ title, lines, onEdit }: ReviewBlockProps) {
  return <Card className="bg-slate-50"><div className="flex items-center justify-between"><h3 className="font-bold">{title}</h3><button type="button" onClick={onEdit} className="text-xs font-semibold text-brand-700">Edit</button></div>{lines.map((line) => <p key={line} className="mt-2 text-sm text-slate-600">{line}</p>)}</Card>;
}
