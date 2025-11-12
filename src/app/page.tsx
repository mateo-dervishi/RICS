import Link from "next/link";
import type { Route } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AIShowcase } from "@/components/shared/ai-showcase";
import { AnalyticsPanel } from "@/components/shared/analytics-panel";

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

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <main className="space-y-10 px-6 py-10 md:px-12 lg:px-24">
      <section className="rounded-3xl bg-gradient-to-br from-primary/10 via-background to-background px-8 py-12 text-center">
        <Badge variant="info" className="mb-4 inline-flex items-center gap-2">
          Trusted RICS companion · Student → FRICS
        </Badge>
        <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
          One platform for every RICS milestone
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
          Map your personalised journey, capture experience evidence, master competencies, prepare documents, and collaborate with
          mentors — all powered by Supabase, Next.js, Tailwind, and shadcn/ui.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/advisor">Launch Pathway Advisor</Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/dashboard">Explore platform workspace</Link>
          </Button>
        </div>
      </section>

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

      <section className="grid gap-6 lg:grid-cols-2">
        <AIShowcase />
        <AnalyticsPanel />
      </section>
    </main>
  );
}
