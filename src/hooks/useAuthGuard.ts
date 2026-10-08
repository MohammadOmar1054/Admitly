"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Role } from "@/types";
import { useAuth } from "@/context/AuthContext";

export function useAuthGuard(role: Role) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== role)) {
      router.replace(user ? (user.role === "admin" ? "/admin/dashboard" : "/student/dashboard") : "/login");
    }
  }, [loading, role, router, user]);

  return { user, loading, authorized: !loading && user?.role === role };
}
