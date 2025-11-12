import { Badge } from "@/components/ui/badge";

interface RouteBadgesProps {
  prerequisites: string[];
  riskFactors: string[];
  competencies: string[];
}

export function RouteBadges({ prerequisites, riskFactors, competencies }: RouteBadgesProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Prerequisites</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {prerequisites.map((item) => (
            <Badge key={item} variant="outline">
              {item}
            </Badge>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Risk Focus</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {riskFactors.map((risk) => (
            <Badge key={risk} variant="warning">
              {risk}
            </Badge>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Competency Priorities</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {competencies.map((competency) => (
            <Badge key={competency} variant="success">
              {competency}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
