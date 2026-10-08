"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { INDIAN_STATES } from "@/lib/constants";
import type { PersonalDetails } from "@/types";

export interface PersonalStepProps {
  value: PersonalDetails;
  errors: Record<string, string>;
  onChange: <K extends keyof PersonalDetails>(field: K, value: PersonalDetails[K]) => void;
}

export function PersonalStep({ value, errors, onChange }: PersonalStepProps) {
  return (
    <section>
      <h2 className="text-xl font-bold">Personal details</h2>
      <p className="mt-1 text-sm text-slate-500">Tell us how to contact you and your guardian.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Input label="Full name" name="fullName" value={value.fullName} error={errors.fullName} onChange={(event) => onChange("fullName", event.target.value)} />
        <Input label="Email address" name="email" type="email" value={value.email} error={errors.email} onChange={(event) => onChange("email", event.target.value)} />
        <Input label="Phone number" name="phone" inputMode="numeric" value={value.phone} error={errors.phone} onChange={(event) => onChange("phone", event.target.value)} />
        <Input label="Date of birth" name="dob" type="date" value={value.dob} error={errors.dob} onChange={(event) => onChange("dob", event.target.value)} />
        <Select label="Gender" name="gender" value={value.gender} options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }, { value: "other", label: "Prefer not to say" }]} onChange={(event) => onChange("gender", event.target.value as PersonalDetails["gender"])} />
        <Input label="Address" name="address" value={value.address} error={errors.address} onChange={(event) => onChange("address", event.target.value)} />
        <Input label="City" name="city" value={value.city} error={errors.city} onChange={(event) => onChange("city", event.target.value)} />
        <Select label="State" name="state" value={value.state} options={[{ value: "", label: "Choose state" }, ...INDIAN_STATES.map((state) => ({ value: state, label: state }))]} onChange={(event) => onChange("state", event.target.value)} />
        <Input label="Pincode" name="pincode" inputMode="numeric" value={value.pincode} error={errors.pincode} onChange={(event) => onChange("pincode", event.target.value)} />
        <Input label="Guardian name" name="guardianName" value={value.guardianName} error={errors.guardianName} onChange={(event) => onChange("guardianName", event.target.value)} />
        <Input label="Guardian phone" name="guardianPhone" inputMode="numeric" value={value.guardianPhone} error={errors.guardianPhone} onChange={(event) => onChange("guardianPhone", event.target.value)} />
      </div>
    </section>
  );
}
