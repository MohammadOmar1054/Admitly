"use client";

import { createContext, useContext, useEffect, useState } from "react";
import * as api from "@/lib/api";
import type { User } from "@/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const Context = createContext<AuthContextValue>({
  user: null,
  loading: true,
  login: async () => { throw new Error("AuthProvider is missing"); },
  register: async () => { throw new Error("AuthProvider is missing"); },
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    void api.getCurrentUser().then(setUser).finally(() => setLoading(false));
  }, []);
  const login = async (email: string, password: string) => {
    const next = await api.login(email, password);
    setUser(next);
    return next;
  };
  const register = async (name: string, email: string, password: string) => {
    const next = await api.register(name, email, password);
    setUser(next);
    return next;
  };
  const logout = async () => {
    await api.logout();
    setUser(null);
  };
  return <Context.Provider value={{ user, loading, login, register, logout }}>{children}</Context.Provider>;
}

export const useAuth = () => useContext(Context);
