import { cn } from "@/lib/utils";
import { STATUS_META } from "@/lib/constants";
import type { ApplicationStatus } from "@/types";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: ApplicationStatus;
}

export function Badge({ status, className, ...props }: BadgeProps) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        meta.color,
        className,
      )}
      {...props}
    >
      <meta.icon size={13} />
      {meta.label}
    </span>
  );
}
