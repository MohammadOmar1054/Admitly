"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Application, ApplicationStatus, DocumentType } from "@/types";
import * as api from "@/lib/api";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

interface ApplicationsContextValue {
  application: Application | null;
  applications: Application[];
  loading: boolean;
  refresh: () => Promise<void>;
  refreshApplications: () => Promise<void>;
  upload: (type: DocumentType, file: { name: string; size: number }) => Promise<void>;
  status: (status: ApplicationStatus, remarks?: string) => Promise<void>;
  updateApplicationStatus: (id: string, status: ApplicationStatus, remarks?: string) => Promise<void>;
  verify: (id: string, type: DocumentType) => Promise<void>;
  reject: (id: string, type: DocumentType, reason: string) => Promise<void>;
}

const Context = createContext<ApplicationsContextValue>({
  application: null,
  applications: [],
  loading: false,
  refresh: async () => {},
  refreshApplications: async () => {},
  upload: async () => {},
  status: async () => {},
  updateApplicationStatus: async () => {},
  verify: async () => {},
  reject: async () => {},
});

export function ApplicationsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [application, setApplication] = useState<Application | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setApplication(null);
      setApplications([]);
      return;
    }
    setLoading(true);
    try {
      const all = await api.getApplications();
      setApplications(all);
      if (user.role === "admin") setApplications(all);
      else setApplication(all.find((item) => item.userId === user.id) ?? null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const refreshApplications = useCallback(async () => {
    setLoading(true);
    try {
      const fresh = await api.getApplications();
      setApplications(fresh);
      if (user?.role === "student") {
        setApplication(fresh.find((item) => item.userId === user.id) ?? null);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const upload = async (type: DocumentType, file: { name: string; size: number }) => {
    if (!application) return;
    setApplication(await api.uploadDocument(application.id, type, file));
    toast.success("Document uploaded");
  };

  const status = async (nextStatus: ApplicationStatus, remarks?: string) => {
    if (!application) return;
    setApplication(await api.updateStatus(application.id, nextStatus, remarks));
    toast.success("Application updated");
  };

  const updateApplicationStatus = async (id: string, nextStatus: ApplicationStatus, remarks?: string) => {
    const updated = await api.updateStatus(id, nextStatus, remarks);
    setApplications((items) => items.some((item) => item.id === id) ? items.map((item) => item.id === id ? updated : item) : [...items, updated]);
    if (application?.id === id) setApplication(updated);
    toast.success("Application updated");
  };

  const verify = async (id: string, type: DocumentType) => {
    const updated = await api.verifyDocument(id, type);
    setApplications((items) => items.some((item) => item.id === id) ? items.map((item) => item.id === id ? updated : item) : [...items, updated]);
    if (application?.id === id) setApplication(updated);
    toast.success("Document verified");
  };

  const reject = async (id: string, type: DocumentType, reason: string) => {
    const updated = await api.rejectDocument(id, type, reason);
    setApplications((items) => items.some((item) => item.id === id) ? items.map((item) => item.id === id ? updated : item) : [...items, updated]);
    if (application?.id === id) setApplication(updated);
    toast.success("Revision requested");
  };

  const value = useMemo(() => ({ application, applications, loading, refresh, refreshApplications, upload, status, updateApplicationStatus, verify, reject }), [application, applications, loading, refresh, refreshApplications]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export const useApplications = () => useContext(Context);
