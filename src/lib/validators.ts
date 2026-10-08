import type { AcademicDetails, PersonalDetails } from "@/types";

export type FieldValues = Record<string, string | number | undefined>;

export function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Enter a valid email address.";
}

export function validatePhone(phone: string) {
  return /^\d{10}$/.test(phone) ? "" : "Enter a 10-digit phone number.";
}

export function validatePincode(pincode: string) {
  return /^\d{6}$/.test(pincode) ? "" : "Enter a 6-digit pincode.";
}

export function validatePercentage(value: number) {
  return Number.isFinite(value) && value >= 0 && value <= 100
    ? ""
    : "Enter a percentage between 0 and 100.";
}

export function validateMinimumAge(dob: string, minimumAge = 15) {
  const date = new Date(dob);
  if (!dob || Number.isNaN(date.getTime())) return "Enter a valid date of birth.";
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - minimumAge);
  const isUnderage = date > cutoff;
  return !isUnderage && date <= new Date() ? "" : `Applicants must be at least ${minimumAge} years old.`;
}

export function validateRequired(values: FieldValues, fields: string[]) {
  return fields.reduce<Record<string, string>>((errors, field) => {
    if (values[field] === undefined || String(values[field]).trim() === "") {
      errors[field] = "This field is required.";
    }
    return errors;
  }, {});
}

export function validatePersonalDetails(details: PersonalDetails) {
  const errors = validateRequired(details as unknown as FieldValues, [
    "fullName",
    "email",
    "phone",
    "dob",
    "address",
    "city",
    "state",
    "pincode",
    "guardianName",
    "guardianPhone",
  ]);
  const emailError = validateEmail(details.email);
  const phoneError = validatePhone(details.phone);
  const guardianPhoneError = validatePhone(details.guardianPhone);
  const pincodeError = validatePincode(details.pincode);
  const ageError = validateMinimumAge(details.dob);
  if (emailError) errors.email = emailError;
  if (phoneError) errors.phone = phoneError;
  if (guardianPhoneError) errors.guardianPhone = guardianPhoneError;
  if (pincodeError) errors.pincode = pincodeError;
  if (ageError) errors.dob = ageError;
  return errors;
}

export function validateAcademicDetails(details: AcademicDetails) {
  const errors = validateRequired(details as unknown as FieldValues, [
    "board10",
    "board12",
    "stream12",
    "schoolName",
  ]);
  const percentage10Error = validatePercentage(details.percentage10);
  const percentage12Error = validatePercentage(details.percentage12);
  if (percentage10Error) errors.percentage10 = percentage10Error;
  if (percentage12Error) errors.percentage12 = percentage12Error;
  return errors;
}
