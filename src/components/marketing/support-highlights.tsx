import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const supportItems = [
  {
    title: "Compliance & Quality",
    badge: "RICS aligned",
    points: [
      "Live competency frameworks mapped to the latest RICS pathway guides",
      "Ethics + inclusive environments module baked into every route",
      "Audit-friendly document versions with reviewer sign-off"
    ]
  },
  {
    title: "Mentors & Counselors",
    badge: "Community",
    points: [
      "Curated MRICS / FRICS mentor marketplace",
      "Meeting scheduler with Supabase-backed notes",
      "Document approval workflow for supervisors"
    ]
  },
  {
    title: "Support & Services",
    badge: "Expert help",
    points: [
      "On-demand advisor chat and document reviews",
      "Mock interview sessions and emergency assessment support",
      "Best practice library, tutorials, and contextual help"
    ]
  }
];

export function SupportHighlights() {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Human + AI support</p>
        <h2 className="text-3xl font-bold">Guidance whenever you need it</h2>
        <p className="text-muted-foreground">
          Pair AI copilots with real counsellors, ensure compliance, and keep every candidate confident through interviews and
          submissions.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {supportItems.map((item) => (
          <Card key={item.title} className="border-dashed">
            <CardHeader>
              <Badge variant="outline">{item.badge}</Badge>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {item.points.map((point) => (
                  <li key={point}>• {point}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
