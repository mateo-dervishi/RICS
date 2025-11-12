"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import type { AdvisorInput } from "@/types";
import { sectorPathways } from "@/data/pathways";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AdvisorFormProps {
  value: AdvisorInput;
  onChange: (value: AdvisorInput) => void;
}

const degrees = [
  { value: "rics-accredited", label: "RICS accredited" },
  { value: "related", label: "Built environment related" },
  { value: "non-related", label: "Non-related" }
] as const;

const membershipLevels: AdvisorInput["membershipLevel"][] = [
  "student",
  "associate",
  "member",
  "senior",
  "academic",
  "fellow"
];

const leadershipLevels: AdvisorInput["leadershipLevel"][] = ["early", "mid", "senior"];

const goals = [
  { value: "student-to-assoc", label: "Student → AssocRICS" },
  { value: "assoc-to-mrics", label: "AssocRICS → MRICS" },
  { value: "direct-mrics", label: "Direct to MRICS" },
  { value: "preliminary-review", label: "Preliminary Review" },
  { value: "direct-entry", label: "Direct Entry" },
  { value: "senior-professional", label: "Senior Professional" },
  { value: "specialist", label: "Specialist" },
  { value: "academic-assessment", label: "Academic Assessment" },
  { value: "fellowship", label: "Fellowship" }
];

export function AdvisorForm({ value, onChange }: AdvisorFormProps) {
  const handlePartialChange = (patch: Partial<AdvisorInput>) => {
    onChange({ ...value, ...patch });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Intelligent Pathway Advisor</CardTitle>
        <CardDescription>
          Provide your current status and ambitions. Recommendations update in real time with AI heuristics derived from historic
          pass data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Current membership level">
            <Select
              value={value.membershipLevel}
              onValueChange={(membershipLevel) =>
                handlePartialChange({ membershipLevel: membershipLevel as AdvisorInput["membershipLevel"] })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {membershipLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Target pathway">
            <Select value={value.goal} onValueChange={(goal) => handlePartialChange({ goal: goal as AdvisorInput["goal"] })}>
              <SelectTrigger>
                <SelectValue placeholder="Choose route" />
              </SelectTrigger>
              <SelectContent>
                {goals.map((goal) => (
                  <SelectItem key={goal.value} value={goal.value}>
                    {goal.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Degree type">
            <Select
              value={value.degreeType}
              onValueChange={(degreeType) => handlePartialChange({ degreeType: degreeType as AdvisorInput["degreeType"] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select degree" />
              </SelectTrigger>
              <SelectContent>
                {degrees.map((degree) => (
                  <SelectItem key={degree.value} value={degree.value}>
                    {degree.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Years of relevant experience">
            <Input
              type="number"
              min={0}
              max={35}
              value={value.experienceYears}
              onChange={(event) => handlePartialChange({ experienceYears: Number(event.target.value) })}
            />
          </Field>

          <Field label="Leadership exposure">
            <Select
              value={value.leadershipLevel}
              onValueChange={(leadershipLevel) => handlePartialChange({ leadershipLevel: leadershipLevel as AdvisorInput["leadershipLevel"] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Leadership" />
              </SelectTrigger>
              <SelectContent>
                {leadershipLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Specialisation">
            <Select value={value.specialization} onValueChange={(specialization) => handlePartialChange({ specialization })}>
              <SelectTrigger>
                <SelectValue placeholder="Select pathway" />
              </SelectTrigger>
              <SelectContent>
                {sectorPathways.map((pathway) => (
                  <SelectItem key={pathway.id} value={pathway.name}>
                    {pathway.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className={cn("flex items-center justify-between rounded-lg border p-4", value.hasCounsellor ? "bg-emerald-50" : "bg-muted")}
        >
          <div>
            <p className="text-sm font-medium">Counsellor / Supervisor Assigned?</p>
            <p className="text-sm text-muted-foreground">Boosts confidence score thanks to structured guidance.</p>
          </div>
          <Switch checked={value.hasCounsellor} onCheckedChange={(hasCounsellor) => handlePartialChange({ hasCounsellor })} />
        </div>
      </CardContent>
    </Card>
  );
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <Label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
    {children}
  </div>
);
