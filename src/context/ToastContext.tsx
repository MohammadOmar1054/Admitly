"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, Info, XCircle } from "lucide-react";

type ToastType = "success" | "error" | "info";
interface ToastMessage { id: number; message: string; type: ToastType }
interface ToastContextValue { toast: Record<ToastType, (message: string) => void> }

const Context = createContext<ToastContextValue>({ toast: { success: () => {}, error: () => {}, info: () => {} } });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();
  const [messages, setMessages] = useState<ToastMessage[]>([]);
  const add = useCallback((type: ToastType) => (message: string) => {
    const id = Date.now() + Math.random();
    setMessages((current) => [...current, { id, message, type }]);
    window.setTimeout(() => setMessages((current) => current.filter((toast) => toast.id !== id)), 3600);
  }, []);
  const toast = {
    success: useCallback((message: string) => add("success")(message), [add]),
    error: useCallback((message: string) => add("error")(message), [add]),
    info: useCallback((message: string) => add("info")(message), [add]),
  };
  return <Context.Provider value={{ toast }}>{children}<div className="fixed bottom-4 right-4 z-[100] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2"> <AnimatePresence>{messages.map((item) => { const Icon = item.type === "success" ? CheckCircle2 : item.type === "error" ? XCircle : Info; const color = item.type === "success" ? "border-emerald-700 bg-emerald-900" : item.type === "error" ? "border-rose-700 bg-rose-900" : "border-slate-700 bg-slate-900"; return <motion.div key={item.id} initial={reducedMotion ? false : { opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={reducedMotion ? undefined : { opacity: 0, y: 10 }} role="status" className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm text-white shadow-xl ${color}`}><Icon size={18} /><span>{item.message}</span></motion.div>; })}</AnimatePresence></div></Context.Provider>;
}

export const useToast = () => useContext(Context);
