"use client";

import { CloudUpload } from "lucide-react";

export interface DocumentUploaderProps {
  accept?: string;
  disabled?: boolean;
  onFile: (file: File) => void;
}

export function DocumentUploader({ accept = ".jpg,.jpeg,.png,.pdf", disabled = false, onFile }: DocumentUploaderProps) {
  return <label className="flex cursor-pointer flex-col items-center rounded-xl border border-dashed border-brand-300 bg-brand-50 px-4 py-5 text-center text-sm font-semibold text-brand-700 transition hover:bg-brand-100 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50"><CloudUpload size={20} /><span className="mt-2">Choose a file or drop it here</span><span className="mt-1 text-xs font-normal text-slate-500">JPG, PNG or PDF · Up to 5 MB</span><input className="sr-only" type="file" accept={accept} disabled={disabled} onChange={(event) => { const file = event.currentTarget.files?.[0]; if (file) onFile(file); event.currentTarget.value = ""; }} /></label>;
}
