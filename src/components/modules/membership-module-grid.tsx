import { membershipModules } from "@/data/modules";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function MembershipModuleGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {membershipModules.map((module) => (
        <Card key={module.id} className="flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="outline">{module.targetAudience}</Badge>
            </div>
            <CardTitle>{module.title}</CardTitle>
            <CardDescription>{module.subtitle}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {module.features.map((feature) => (
              <div key={feature.id} className="rounded-lg border border-dashed border-border/60 p-4">
                <p className="font-semibold">{feature.title}</p>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
                <ul className="mt-2 text-xs text-muted-foreground">
                  {feature.actions.map((action) => (
                    <li key={action}>• {action}</li>
                  ))}
                </ul>
                <dl className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  {feature.metrics.map((metric) => (
                    <div key={metric.label}>
                      <dt className="text-muted-foreground">{metric.label}</dt>
                      <dd className="font-semibold">{metric.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </CardContent>
          <CardFooter className="mt-auto">
            <Button className="w-full">{module.cta}</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
