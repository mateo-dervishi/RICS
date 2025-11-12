import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const aiCapabilities = [
  {
    title: "Personalised Pathway Engine",
    description: "Multi-factor scoring combines experience, education, leadership, and competency data to recommend optimal routes.",
    metrics: ["Success probability", "Risk profile", "Timeline tuning"]
  },
  {
    title: "Smart Content Generation",
    description: "AI writing assistant drafts competency statements, case study outlines, and ethics reflections with RICS tone of voice.",
    metrics: ["Summary of Experience", "Case study", "Fellowship statements"]
  },
  {
    title: "Predictive Analytics",
    description: "Supabase telemetry feeds readiness scores, CPD projections, and logbook completion forecasts.",
    metrics: ["Readiness score", "CPD forecast", "Assessment risk"]
  }
];

export function AIShowcase() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Advisor</CardTitle>
        <CardDescription>Explainable recommendations with human override controls.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {aiCapabilities.map((capability) => (
          <div key={capability.title} className="rounded-lg border border-dashed border-border/60 p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{capability.title}</p>
              <Badge variant="outline">AI</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{capability.description}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {capability.metrics.map((metric) => (
                <Badge key={metric} variant="info">
                  {metric}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
