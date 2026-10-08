import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id ?? props.name;
  return (
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor={inputId}>
      {label}
      <input
        id={inputId}
        className={cn(
          "focus mt-2 w-full rounded-xl border bg-white px-4 py-3 text-slate-900 transition-colors placeholder:text-slate-400 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500",
          error ? "border-rose-300" : "border-slate-200",
          className,
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && <span id={`${inputId}-error`} className="mt-1 block text-xs text-rose-600">{error}</span>}
    </label>
  );
}
