import { Badge } from "@/components/ui/badge";
import type { Phase } from "@/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  Phase["status"],
  { label: string; className: string; dotClass: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-muted text-muted-foreground",
    dotClass: "bg-muted-foreground/40",
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-info/15 text-info border-info/30",
    dotClass: "bg-info animate-pulse-glow",
  },
  approved: {
    label: "Approved",
    className: "bg-success/15 text-success border-success/30",
    dotClass: "bg-success",
  },
  "needs-revision": {
    label: "Needs Revision",
    className: "bg-warning/15 text-warning border-warning/30",
    dotClass: "bg-warning",
  },
  completed: {
    label: "Completed",
    className: "bg-success/15 text-success border-success/30",
    dotClass: "bg-success",
  },
};

interface Props {
  phase: Phase;
  compact?: boolean;
}

export function PhaseStatusBadge({ phase, compact }: Props) {
  const config = statusConfig[phase.status];

  if (compact) {
    return (
      <div
        className="flex items-center gap-1.5"
        title={`${phase.label}: ${config.label}`}
      >
        <span className={cn("h-2 w-2 rounded-full shrink-0", config.dotClass)} />
        <span className="text-[11px] text-muted-foreground hidden sm:inline">
          {phase.label}
        </span>
      </div>
    );
  }

  return (
    <Badge variant="outline" className={cn("text-xs font-normal gap-1.5", config.className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dotClass)} />
      {config.label}
    </Badge>
  );
}
