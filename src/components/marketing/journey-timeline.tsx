"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const journeys = [
  {
    id: "student",
    label: "Student",
    badge: "Free tier",
    summary: "Secure student membership, align modules to competencies, plan placement year APC.",
    steps: [
      "Verify accredited degree and enrol via guided wizard",
      "Map course modules to mandatory competencies",
      "Plan placement year diaries with Matrics mentors"
    ]
  },
  {
    id: "assoc",
    label: "AssocRICS",
    badge: "Professional",
    summary: "Track experience requirement, select 13 sector pathways, prep portfolio and assessment.",
    steps: [
      "Experience tracker auto-calculates based on qualifications",
      "Competency dev plans with AI suggestions",
      "Portfolio builder with template + reviewer workflow"
    ]
  },
  {
    id: "mrics",
    label: "MRICS",
    badge: "APC / Senior",
    summary:
      "Manage structured training, alternate routes (prelim review, direct entry, SPA), and final assessment logistics.",
    steps: [
      "Diary + competency heatmap with counsellor approvals",
      "Document centre for SoE, case study, CPD records",
      "Interview simulator + question banks"
    ]
  },
  {
    id: "fellow",
    label: "FRICS",
    badge: "Fellowship",
    summary: "Select four characteristics, manage statements, compile evidence, prep peer review.",
    steps: [
      "Characteristic selector with evidence vault",
      "Peer reviewer coordination + coaching",
      "Application status + fee planning"
    ]
  }
];

export function JourneyTimeline() {
  const [active, setActive] = useState(journeys[0].id);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Interactive journey</p>
          <h2 className="text-3xl font-bold">Navigate every RICS milestone</h2>
          <p className="text-muted-foreground">Toggle through the lifecycle to see what tooling unlocks at each tier.</p>
        </div>
      </div>
      <Tabs value={active} onValueChange={setActive} className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          {journeys.map((journey) => (
            <TabsTrigger key={journey.id} value={journey.id} className="flex-1 whitespace-nowrap">
              {journey.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {journeys.map((journey) => (
          <TabsContent key={journey.id} value={journey.id}>
            <Card className="border-dashed">
              <CardHeader className="space-y-2">
                <div className="flex items-center gap-2">
                  <CardTitle>{journey.label}</CardTitle>
                  <Badge variant="outline">{journey.badge}</Badge>
                </div>
                <p className="text-muted-foreground">{journey.summary}</p>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  {journey.steps.map((step) => (
                    <li key={step} className="rounded-lg border border-border/70 bg-muted/30 p-3">{step}</li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
