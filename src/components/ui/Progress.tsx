import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  label?: string;
}

export function Progress({ value, label, className, ...props }: ProgressProps) {
  const bounded = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("w-full", className)} {...props}>
      {label && <div className="mb-2 flex justify-between text-xs text-slate-500"><span>{label}</span><span>{bounded}%</span></div>}
      <div className="h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={bounded} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-brand-600 transition-[width] duration-500" style={{ width: `${bounded}%` }} />
      </div>
    </div>
  );
}
