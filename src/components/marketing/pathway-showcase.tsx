import { sectorPathways } from "@/data/pathways";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const highlighted = sectorPathways.slice(0, 6);

export function PathwayShowcase() {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">22 sector pathways</p>
          <h2 className="text-3xl font-bold">Pathway management for every discipline</h2>
          <p className="text-muted-foreground">
            Switch pathways with confidence, review competencies, and stay ahead of sector trends powered by live insights.
          </p>
        </div>
        <Badge variant="info">AssocRICS · MRICS · FRICS</Badge>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {highlighted.map((pathway) => (
          <Card key={pathway.id} className="border-dashed">
            <CardHeader className="space-y-1">
              <CardTitle className="flex items-center justify-between text-lg">
                {pathway.name}
                <Badge variant="outline">{pathway.type.toUpperCase()}</Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">{pathway.description}</p>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-xs uppercase text-muted-foreground">Competency focus</p>
                <ul className="mt-1 list-disc pl-5">
                  {pathway.competencies.slice(0, 3).map((competency) => (
                    <li key={competency}>{competency}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">Trend signal</p>
                <p>{pathway.emergingTrends[0]}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
