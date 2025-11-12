import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mandatoryCompetencies, cpdRequirements } from "@/data/competencies";
import { sectorPathways } from "@/data/pathways";
import { subscriptionTiers } from "@/data/subscriptions";

export function PlatformDashboard() {
  const competenciesComplete = 18;
  const competenciesTarget = 32;
  const cpdRequirement = cpdRequirements.find((req) => req.id === "mrics");

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Competency Coverage</CardTitle>
            <CardDescription>Mandatory + core competencies tracked via Supabase logs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline justify-between">
              <p className="text-3xl font-bold">{competenciesComplete}</p>
              <p className="text-sm text-muted-foreground">of {competenciesTarget}</p>
            </div>
            <Progress value={(competenciesComplete / competenciesTarget) * 100} />
            <p className="text-xs text-muted-foreground">Live gap analysis updates whenever diary entries are logged.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Experience Diary</CardTitle>
            <CardDescription>Structured training requirement (400+ days).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline justify-between">
              <p className="text-3xl font-bold">412 days</p>
              <Badge variant="success">On track</Badge>
            </div>
            <Progress value={82} />
            <p className="text-xs text-muted-foreground">Auto-sync with project database and counsellor approvals.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CPD Compliance</CardTitle>
            <CardDescription>Formal + informal CPD linked to competencies.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline justify-between">
              <p className="text-3xl font-bold">38 hrs</p>
              <p className="text-sm text-muted-foreground">min {cpdRequirement?.minimumHours ?? 20} hrs</p>
            </div>
            <Progress value={Math.min(100, (38 / (cpdRequirement?.minimumHours ?? 20)) * 100)} />
            <p className="text-xs text-muted-foreground">Add certificates, tag competencies, and export RICS-ready reports.</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Mandatory Competencies</CardTitle>
            <CardDescription>Dynamic framework that maps experience entries to competency levels.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {mandatoryCompetencies.map((competency) => (
                <div key={competency.id} className="rounded-lg border border-dashed border-border/70 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{competency.name}</p>
                    <Badge variant="outline">Level {competency.requiredLevel}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{competency.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pathway Insights</CardTitle>
            <CardDescription>22 MRICS sector pathways with switching guidance.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {sectorPathways.slice(0, 5).map((pathway) => (
              <div key={pathway.id} className="border-b border-dashed border-border/50 pb-3 last:border-0 last:pb-0">
                <p className="text-sm font-semibold">{pathway.name}</p>
                <p className="text-xs text-muted-foreground">{pathway.emergingTrends[0]}</p>
              </div>
            ))}
            <Button variant="link" className="px-0 text-sm">
              View all pathways →
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Document Preparation Centre</CardTitle>
            <CardDescription>Templates, versioning, AI writing assistant, and peer reviews.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <p>Summary of Experience</p>
              <Badge variant="success">1500 / 4000 words</Badge>
            </div>
            <div className="flex items-center justify-between">
              <p>Case Study</p>
              <Badge variant="warning">Draft</Badge>
            </div>
            <div className="flex items-center justify-between">
              <p>CPD Record</p>
              <Badge variant="success">Validated</Badge>
            </div>
            <Button size="sm" className="mt-4">
              Open doc workspace
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Planner</CardTitle>
            <CardDescription>Fees, employer reimbursements, and scholarship tracking.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <p>Current spend</p>
              <p className="font-semibold">£1,214</p>
            </div>
            <div className="flex items-center justify-between">
              <p>Employer reimbursements</p>
              <Badge variant="outline">£600 pending</Badge>
            </div>
            <div className="rounded-lg border border-dashed border-border/60 p-3">
              <p className="text-xs uppercase text-muted-foreground">Scholarships & grants</p>
              <p className="font-semibold">3 matches available</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Subscription tiers</CardTitle>
            <CardDescription>Monetisation options aligned to journey milestones.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {subscriptionTiers.map((tier) => (
              <div key={tier.id} className="rounded-lg border border-border/70 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{tier.badge}</p>
                    <p className="text-xs text-muted-foreground">{tier.targetUsers}</p>
                  </div>
                  <p className="text-base font-bold">{tier.price}</p>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{tier.features.slice(0, 2).join(" • ")}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Networking & Mentoring</CardTitle>
            <CardDescription>Connect with counsellors, mentors, employers, and Matrics chapters.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <p>Mentors</p>
              <Badge variant="info">24 MRICS / 6 FRICS</Badge>
            </div>
            <div className="flex items-center justify-between">
              <p>Upcoming Matrics events</p>
              <Badge variant="outline">4 this month</Badge>
            </div>
            <div className="flex items-center justify-between">
              <p>Employer programmes</p>
              <Badge variant="success">12 active</Badge>
            </div>
            <Button variant="secondary" size="sm">
              Launch community hub
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
