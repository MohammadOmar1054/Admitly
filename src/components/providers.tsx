"use client";

import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { ApplicationsProvider } from "@/context/ApplicationsContext";

export interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return <ToastProvider><AuthProvider><ApplicationsProvider>{children}</ApplicationsProvider></AuthProvider></ToastProvider>;
}
