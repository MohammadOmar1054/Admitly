"use client";

import { Button } from "@/components/ui/Button";

export interface DemoCredentialsProps {
  onSelect: (email: string, password: string) => void;
  onLogin: (email: string, password: string) => void;
}

export function DemoCredentials({ onSelect, onLogin }: DemoCredentialsProps) {
  return (
    <div className="rounded-xl bg-brand-50 p-4 text-sm">
      <b>Try a demo account</b>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={() => { onSelect("student@demo.com", "student123"); onLogin("student@demo.com", "student123"); }}>Login as Student</Button>
        <Button type="button" variant="secondary" size="sm" onClick={() => { onSelect("admin@demo.com", "admin123"); onLogin("admin@demo.com", "admin123"); }}>Login as Admin</Button>
      </div>
    </div>
  );
}
