"use client";

import { Input } from "@/components/ui/Input";
import type { PersonalDetails } from "@/types";

export interface PersonalStepProps {
  value: PersonalDetails;
  errors: Record<string, string>;
  onChange: <K extends keyof PersonalDetails>(field: K, value: PersonalDetails[K]) => void;
}

export function PersonalStep({ value, errors, onChange }: PersonalStepProps) {
  return <section><h2 className="text-xl font-bold">Personal details</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><Input label="Full name" name="fullName" value={value.fullName} error={errors.fullName} onChange={(event) => onChange("fullName", event.target.value)} /><Input label="Email address" name="email" type="email" value={value.email} error={errors.email} onChange={(event) => onChange("email", event.target.value)} /><Input label="Phone number" name="phone" inputMode="numeric" value={value.phone} error={errors.phone} onChange={(event) => onChange("phone", event.target.value)} /><Input label="Date of birth" name="dob" type="date" value={value.dob} error={errors.dob} onChange={(event) => onChange("dob", event.target.value)} /><Input label="Address" name="address" value={value.address} error={errors.address} onChange={(event) => onChange("address", event.target.value)} /><Input label="City" name="city" value={value.city} error={errors.city} onChange={(event) => onChange("city", event.target.value)} /></div></section>;
}
