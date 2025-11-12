import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { PathwayRecommendation } from "@/types";
import { TimelineProjectionView } from "./timeline-projection";
import { CostBreakdown } from "./cost-breakdown";
import { RouteBadges } from "./route-badges";
import { Badge } from "@/components/ui/badge";

interface Props {
  recommendations: PathwayRecommendation[];
}

export function RecommendationPanel({ recommendations }: Props) {
  return (
    <div className="space-y-4">
      {recommendations.map((recommendation) => (
        <Card key={recommendation.route} className="border-primary/20">
          <CardHeader className="gap-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  {recommendation.title}
                  <Badge variant="info">{recommendation.route}</Badge>
                </CardTitle>
                <CardDescription>{recommendation.rationale}</CardDescription>
              </div>
              <div className="w-40">
                <p className="text-xs uppercase text-muted-foreground">Success Probability</p>
                <p className="text-right text-3xl font-bold">{recommendation.confidence}%</p>
                <Progress value={recommendation.successProbability} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <TimelineProjectionView timeline={recommendation.timeline} />
            <RouteBadges
              prerequisites={recommendation.prerequisites}
              riskFactors={recommendation.riskFactors}
              competencies={recommendation.suggestedCompetencies}
            />
            <CostBreakdown costs={recommendation.costs} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
