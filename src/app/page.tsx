import Link from "next/link";
import type { Route } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AIShowcase } from "@/components/shared/ai-showcase";
import { AnalyticsPanel } from "@/components/shared/analytics-panel";
import { ModulePreview } from "@/components/marketing/module-preview";
import { PathwayShowcase } from "@/components/marketing/pathway-showcase";
import { SubscriptionShowcase } from "@/components/marketing/subscription-showcase";
import { SupportHighlights } from "@/components/marketing/support-highlights";
import { Hero } from "@/components/marketing/hero";
import { JourneyTimeline } from "@/components/marketing/journey-timeline";
import { ImpactStats } from "@/components/marketing/impact-stats";

type FeaturePillar = {
  title: string;
  detail: string;
  href: Route;
};

const featurePillars: FeaturePillar[] = [
  {
    title: "Intelligent Pathway Advisor",
    detail: "Decision tree + AI scoring covering Student membership through FRICS.",
    href: "/advisor"
  },
  {
    title: "Competency & Experience OS",
    detail: "Diary, CPD, evidence, and document preparation aligned to RICS frameworks.",
    href: "/dashboard"
  },
  {
    title: "Community & Employer Network",
    detail: "Mentors, counsellors, employer APC programs, and Matrics integration.",
    href: "/community"
  }
];

export default function HomePage() {
  return (
    <main className="space-y-12 px-6 py-10 md:px-12 lg:px-24">
      <Hero />

      <section className="grid gap-4 md:grid-cols-3">
        {featurePillars.map((pillar) => (
          <Card key={pillar.title}>
            <CardContent className="space-y-2 p-6">
              <p className="text-xs uppercase text-muted-foreground">End-to-end coverage</p>
              <p className="text-lg font-semibold">{pillar.title}</p>
              <p className="text-sm text-muted-foreground">{pillar.detail}</p>
              <Button variant="link" className="px-0" asChild>
                <Link href={pillar.href}>Open module →</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      <JourneyTimeline />

      <ImpactStats />

      <ModulePreview />

      <section className="grid gap-6 lg:grid-cols-2">
        <AIShowcase />
        <AnalyticsPanel />
      </section>

      <PathwayShowcase />

      <SubscriptionShowcase />

      <SupportHighlights />
    </main>
  );
}
