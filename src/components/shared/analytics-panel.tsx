import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const analytics = [
  { label: "Average time to MRICS", value: "27.4 months", change: "-2.1m vs cohort" },
  { label: "Assessment success rate", value: "82%", change: "+6% YoY" },
  { label: "Competency completion", value: "91%", change: "+4% vs plan" },
  { label: "CPD compliance", value: "98%", change: "+9%" }
];

export function AnalyticsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Outcome Analytics</CardTitle>
        <CardDescription>Supabase warehouse + Vercel cron pipelines feed longitudinal insights.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        {analytics.map((item) => (
          <div key={item.label} className="rounded-lg border border-dashed border-border/60 p-4">
            <p className="text-xs uppercase text-muted-foreground">{item.label}</p>
            <p className="text-2xl font-semibold">{item.value}</p>
            <p className="text-xs text-emerald-600">{item.change}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
