import { membershipModules } from "@/data/modules";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const previewModules = membershipModules.slice(0, 3);

export function ModulePreview() {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Lifecycle coverage</p>
          <h2 className="text-3xl font-bold">Student through FRICS modules</h2>
          <p className="text-muted-foreground">
            Dedicated workspaces for Academic Assessment, AssocRICS, APC, senior routes, and Fellowship with AI coaching and
            Supabase-backed evidence.
          </p>
        </div>
        <Button variant="secondary" asChild>
          <a href="/modules">Explore all modules</a>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {previewModules.map((module) => (
          <Card key={module.id} className="border-dashed">
            <CardHeader>
              <Badge variant="outline">{module.targetAudience}</Badge>
              <CardTitle>{module.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{module.subtitle}</p>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {module.features.map((feature) => (
                <div key={feature.id} className="rounded-lg border border-border/60 p-3">
                  <p className="font-semibold">{feature.title}</p>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
