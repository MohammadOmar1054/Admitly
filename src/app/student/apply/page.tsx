"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, CircleCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useApplications } from "@/context/ApplicationsContext";
import * as api from "@/lib/api";
import { DOCUMENT_META } from "@/lib/constants";
import { validateAcademicDetails, validateEmail, validateMinimumAge, validatePincode, validatePhone, validateRequired } from "@/lib/validators";
import type { AcademicDetails, PersonalDetails } from "@/types";
import { AcademicStep, CourseStep, DocumentsStep, PersonalStep, ReviewStep, StepIndicator } from "@/components/student";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { Progress } from "@/components/ui/Progress";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/context/ToastContext";

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
      <StepIndicator steps={steps} activeStep={step} onStepChange={setStep} />
      <Progress className="mt-4" value={step * 25} label={`Step ${step + 1} of 5`} />
      <form onSubmit={advance} className="mt-6"><Card><AnimatePresence mode="wait"><motion.div key={step} initial={reducedMotion ? false : { opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={reducedMotion ? undefined : { opacity: 0, x: -12 }} transition={{ duration: reducedMotion ? 0 : .25 }}>
        {step === 0 && <PersonalStep value={personal} errors={errors} onChange={setPersonalField} />}
        {step === 1 && <AcademicStep value={academic} errors={errors} onChange={setAcademicField} />}
        {step === 2 && <CourseStep value={course} percentage12={academic.percentage12} error={errors.firstChoice} onChange={setCourse} />}
        {step === 3 && <DocumentsStep documents={documents} error={errors.documents} />}
        {step === 4 && <ReviewStep personal={personal} academic={academic} course={course} documents={documents} />}      </motion.div></AnimatePresence>
      <div className="mt-7 flex flex-wrap items-center justify-between gap-3"><Button type="button" variant="secondary" disabled={step === 0 || busy} onClick={() => setStep((current) => Math.max(0, current - 1))}><ArrowLeft className="mr-2 inline" size={15} />Back</Button>{step < 4 ? <Button type="submit" disabled={busy}>Save & continue <ArrowRight className="ml-2 inline" size={15} /></Button> : <Button type="button" disabled={busy} onClick={() => setConfirm(true)}>Submit application <Check className="ml-2 inline" size={15} /></Button>}</div>
      </Card></form>
      <Modal open={confirm} onClose={() => setConfirm(false)} title="Submit your application?"><p className="text-sm leading-6 text-slate-600">Your application details will become read-only after submission. You can still respond to document revision requests.</p>{submitError && <p role="alert" className="mt-3 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{submitError}</p>}<div className="mt-6 flex justify-end gap-3"><Button variant="secondary" onClick={() => setConfirm(false)}>Keep reviewing</Button><Button disabled={busy} onClick={() => void submit()}>{busy ? "Submitting…" : "Confirm submission"}</Button></div></Modal>
    </div>
  );
}
