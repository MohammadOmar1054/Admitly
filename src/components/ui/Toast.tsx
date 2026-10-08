"use client";

export interface ToastProps {
  message: string;
  kind?: "success" | "error" | "info";
  onDismiss?: () => void;
}

export function Toast({ message, kind = "info", onDismiss }: ToastProps) {
  const color = kind === "success" ? "bg-emerald-600" : kind === "error" ? "bg-rose-600" : "bg-slate-900";
  return <div role="status" className={`flex items-center justify-between gap-4 rounded-xl px-5 py-4 text-sm text-white shadow-xl ${color}`}>{message}{onDismiss && <button type="button" onClick={onDismiss} aria-label="Dismiss notification" className="rounded-md px-2 py-1 hover:bg-white/15">×</button>}</div>;
}
