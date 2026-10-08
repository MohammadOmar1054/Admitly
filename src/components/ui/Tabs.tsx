"use client";

export interface TabOption {
  id: string;
  label: string;
}

export interface TabsProps {
  tabs: TabOption[];
  value: string;
  onChange: (value: string) => void;
}

export function Tabs({ tabs, value, onChange }: TabsProps) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-slate-200" role="tablist">
      {tabs.map((tab) => (
        <button key={tab.id} type="button" role="tab" aria-selected={value === tab.id} onClick={() => onChange(tab.id)} className={`shrink-0 border-b-2 px-4 py-3 text-sm font-semibold ${value === tab.id ? "border-brand-600 text-brand-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
