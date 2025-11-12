import type { TimelineProjection } from "@/types";
import { Badge } from "@/components/ui/badge";

interface TimelineProps {
  timeline: TimelineProjection;
}

export function TimelineProjectionView({ timeline }: TimelineProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Badge variant="info">{timeline.minMonths} - {timeline.maxMonths} months</Badge>
        <span>Projected journey</span>
      </div>
      <ol className="grid gap-3 md:grid-cols-5">
        {timeline.milestones.map((milestone) => (
          <li key={milestone.label} className="rounded-lg border border-dashed border-border/70 bg-muted/40 p-3">
            <p className="text-xs uppercase text-muted-foreground">Month {milestone.month}</p>
            <p className="text-sm font-semibold">{milestone.label}</p>
            <p className="text-xs text-muted-foreground">{milestone.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
