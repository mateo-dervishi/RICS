import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const stats = [
  { label: "Candidates coached", value: "12,400+" },
  { label: "Avg. time to MRICS", value: "27.4 months" },
  { label: "Pass rate uplift", value: "+18%" }
];

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-background to-background px-6 py-12 md:px-12">
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="space-y-6 lg:w-1/2">
          <Badge variant="info" className="w-fit">
            Full RICS journey OS
          </Badge>
          <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
            Plan, evidence, and gain RICS status with an interactive workspace
          </h1>
          <p className="text-lg text-muted-foreground">
            Map every competency, capture APC diaries, collaborate with counsellors, and unlock Fellowship tooling — all inside a
            single Supabase-connected platform.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <Link href="/advisor">Launch Pathway Advisor</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/dashboard">See candidate workspace</Link>
            </Button>
          </div>
        </div>
        <div className="relative flex-1 rounded-3xl border bg-card/80 p-6 shadow-lg">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">Live workspace preview</p>
          <div className="mt-4 space-y-4 text-sm">
            <div className="rounded-2xl border border-dashed border-primary/40 bg-gradient-to-r from-primary/5 to-primary/10 p-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Route confidence</span>
                <span>MRICS (APC)</span>
              </div>
              <p className="mt-2 text-3xl font-semibold text-primary">84%</p>
              <p className="text-muted-foreground">Based on experience, accreditation, leadership data.</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-border/80 p-3">
                <p className="text-xs uppercase text-muted-foreground">Diary progress</p>
                <p className="text-2xl font-semibold">412 / 400 days</p>
                <p className="text-xs text-muted-foreground">Signed off by counsellor</p>
              </div>
              <div className="rounded-xl border border-border/80 p-3">
                <p className="text-xs uppercase text-muted-foreground">CPD hours</p>
                <p className="text-2xl font-semibold">38 / 48 hrs</p>
                <p className="text-xs text-muted-foreground">Auto-linked to competencies</p>
              </div>
            </div>
            <div className="rounded-xl border border-border/80 p-3">
              <p className="text-xs uppercase text-muted-foreground">Upcoming milestones</p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                <li>• Submit preliminary review — 14 days</li>
                <li>• Final assessment mock interview — 32 days</li>
                <li>• Fellowship characteristic workshop — 6 wks</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <dl className="mt-10 grid gap-4 rounded-2xl border border-dashed bg-background/60 p-4 text-sm text-muted-foreground md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dt>{stat.label}</dt>
            <dd className="text-2xl font-semibold text-foreground">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
