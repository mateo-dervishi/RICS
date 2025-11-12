"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const leadershipLevels = [
  { value: "early", label: "Early career" },
  { value: "mid", label: "Mid" },
  { value: "senior", label: "Senior" }
];

const messages: Record<string, string> = {
  student: "Focus on Matrics events and accredited modules to build early evidence.",
  assoc: "Leverage portfolio builder + AI writing assistant to accelerate submission.",
  member: "Diary + competency heatmap highlight remaining level 3 gaps.",
  fellow: "Characteristic selector surfaces evidence to position you as a Champion + Influencer."
};

function getRoute(experience: number, leadership: string) {
  if (experience < 2) return "student";
  if (experience < 5) return leadership === "senior" ? "assoc" : "assoc";
  if (experience < 10) return leadership === "senior" ? "member" : "member";
  return "fellow";
}

const labels: Record<string, string> = {
  student: "Student → AssocRICS",
  assoc: "AssocRICS → MRICS",
  member: "MRICS (APC / alternate routes)",
  fellow: "FRICS submission"
};

export function ImpactStats() {
  const [experience, setExperience] = useState(4);
  const [leadership, setLeadership] = useState("mid");

  const route = useMemo(() => getRoute(experience, leadership), [experience, leadership]);

  return (
    <section className="grid gap-6 lg:grid-cols-[360px,1fr]">
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Journey estimator</CardTitle>
          <p className="text-sm text-muted-foreground">Adjust experience + leadership to preview the recommended route.</p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Years of relevant experience: {experience}</Label>
            <Slider value={[experience]} min={0} max={20} step={1} onValueChange={([val]) => setExperience(val)} />
          </div>
          <div className="space-y-2">
            <Label>Leadership exposure</Label>
            <Select value={leadership} onValueChange={setLeadership}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {leadershipLevels.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-2xl border border-primary/40 bg-primary/5 p-4">
            <p className="text-xs uppercase text-muted-foreground">Suggested route</p>
            <p className="text-2xl font-semibold">{labels[route]}</p>
            <p className="text-sm text-muted-foreground">{messages[route]}</p>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        {[
          { label: "Success probability", value: route === "fellow" ? "57%" : route === "member" ? "84%" : "72%" },
          { label: "Projected timeline", value: route === "fellow" ? "9-18 months" : "6-12 months" },
          { label: "Estimated investment", value: route === "student" ? "£0-£502" : "£1.5k" },
          { label: "Competencies to focus", value: route === "member" ? "Ethics • Contract Admin" : "Client care" }
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="space-y-2 p-5">
              <Badge variant="outline">{item.label}</Badge>
              <p className="text-2xl font-semibold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
