"use client";

import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { ApplicationsProvider } from "@/context/ApplicationsContext";
import { AmbientBackground } from "@/components/ui/AmbientBackground";

export interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ToastProvider>
      <AuthProvider>
        <ApplicationsProvider>
          <AmbientBackground />
          <div className="relative z-10 min-h-screen">{children}</div>
        </ApplicationsProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
