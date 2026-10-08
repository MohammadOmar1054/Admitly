"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { validateEmail, validateRequired } from "@/lib/validators";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AuthSplitLayout } from "./AuthSplitLayout";
import { DemoCredentials } from "./DemoCredentials";

export interface AuthFormProps {
  register?: boolean;
}

export function AuthForm({ register = false }: AuthFormProps) {
  const auth = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("student@demo.com");
  const [password, setPassword] = useState("student123");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [shake, setShake] = useState(false);

  const redirect = (user: { role: string }) =>
    router.push(user.role === "admin" ? "/admin/dashboard" : "/student/dashboard");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const required = validateRequired({ name, email, password }, register ? ["name", "email", "password"] : ["email", "password"]);
    if (required.email || validateEmail(email)) {
      setError(required.email || validateEmail(email));
      return;
    }
    setBusy(true);
    setError("");
    try {
      redirect(register ? await auth.register(name, email, password) : await auth.login(email, password));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not continue");
      setShake(true);
      window.setTimeout(() => setShake(false), 500);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthSplitLayout register={register}>
      <motion.form animate={shake ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }} onSubmit={submit} className="mt-8 space-y-5">
        <div><h1 className="text-3xl font-bold">{register ? "Begin your journey" : "Welcome back"}</h1><p className="mt-2 text-slate-500">{register ? "Create your student account in minutes." : "Sign in to manage your application."}</p></div>
        {register && <Input label="Full name" name="name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required />}
        <Input label="Email address" name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <Input label="Password" name="password" type="password" autoComplete={register ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} />
        {error && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
        <Button disabled={busy} className="w-full">{busy ? "Please wait…" : register ? "Create account" : "Sign in"}</Button>
        {!register && <DemoCredentials onSelect={(nextEmail, nextPassword) => { setEmail(nextEmail); setPassword(nextPassword); }} onLogin={async (nextEmail, nextPassword) => { setBusy(true); setError(""); try { redirect(await auth.login(nextEmail, nextPassword)); } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not sign in"); setShake(true); window.setTimeout(() => setShake(false), 500); } finally { setBusy(false); } }} />}
        <p className="text-sm text-slate-500">{register ? "Already registered?" : "New to Admitly?"} <Link className="font-semibold text-brand-600" href={register ? "/login" : "/register"}>{register ? "Sign in" : "Create account"}</Link></p>
      </motion.form>
    </AuthSplitLayout>
  );
}
