import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  const textareaId = id ?? props.name;
  return (
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor={textareaId}>
      {label}
      <textarea
        id={textareaId}
        className={cn(
          "focus mt-2 w-full rounded-xl border bg-white px-4 py-3 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500",
          error ? "border-rose-300" : "border-slate-200",
          className,
        )}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-rose-600">{error}</span>}
    </label>
  );
}
