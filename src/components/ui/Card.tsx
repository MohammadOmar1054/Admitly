import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
  interactive?: boolean;
}

export function Card({ children, className, padded = true, interactive = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_35px_-28px_rgba(15,23,42,0.35)] transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-[0_14px_45px_-30px_rgba(0,0,0,0.8)]",
        padded && "p-5",
        interactive && "transition duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg dark:hover:border-brand-700",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
