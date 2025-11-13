"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mandatoryCompetencies } from "@/data/competencies";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useUser } from "@/lib/user-context";
import { getSupabaseWithUserId } from "@/lib/user-helpers";

interface UserCompetency {
  id: string;
  competency_id: string;
  current_level: number;
  achieved_level: number;
  evidence_count: number;
  supervisor_signoff: boolean;
  counsellor_signoff: boolean;
  competency_name?: string;
  required_level?: number;
  type?: string;
}

export default function CompetenciesPage() {
  const { user } = useUser();
  const [competencies, setCompetencies] = useState<UserCompetency[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPathway, setUserPathway] = useState<string>(user?.pathway || "");

  useEffect(() => {
    loadCompetencies();
  }, []);

  const loadCompetencies = async () => {
    try {
      const { getSupabaseWithUserId } = await import("@/lib/user-helpers");
      const { supabase, userId } = await getSupabaseWithUserId();

      // Get user pathway from local storage or Supabase
      if (user?.pathway) {
        setUserPathway(user.pathway);
      } else {
        try {
          const { data: userData } = await supabase.from("users").select("pathway").eq("id", userId).single();
          if (userData) setUserPathway(userData.pathway || "");
        } catch (e) {
          // Supabase not available - use local storage
        }
      }

      // Load user competencies
      const { data: userCompetencies } = await supabase
        .from("user_competencies")
        .select("*")
        .eq("user_id", userId);

      // Merge with mandatory competencies
      const merged = mandatoryCompetencies.map((comp) => {
        const userComp = userCompetencies?.find((uc) => uc.competency_id === comp.id);
        return {
          id: comp.id,
          competency_id: comp.id,
          competency_name: comp.name,
          required_level: comp.requiredLevel,
          type: comp.type,
          current_level: userComp?.current_level || 0,
          achieved_level: userComp?.achieved_level || 0,
          evidence_count: userComp?.evidence_count || 0,
          supervisor_signoff: userComp?.supervisor_signoff || false,
          counsellor_signoff: userComp?.counsellor_signoff || false
        };
      });

      setCompetencies(merged);
    } catch (error: any) {
      toast.error("Failed to load competencies");
    } finally {
      setLoading(false);
    }
  };

  const getLevelStatus = (current: number, required: number) => {
    if (current >= required) return "complete";
    if (current > 0) return "in-progress";
    return "not-started";
  };

  const getLevelBadge = (level: number) => {
    const colors = {
      0: "bg-gray-100 text-gray-600",
      1: "bg-blue-100 text-blue-700",
      2: "bg-green-100 text-green-700",
      3: "bg-purple-100 text-purple-700"
    };
    return colors[level as keyof typeof colors] || colors[0];
  };

  const mandatoryComplete = competencies.filter((c) => c.current_level >= (c.required_level || 0)).length;
  const mandatoryTotal = competencies.length;
  const progressPercentage = (mandatoryComplete / mandatoryTotal) * 100;

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading competencies...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Competency Tracker</h1>
        <p className="text-muted-foreground">Track your progress towards achieving required competency levels</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
          <CardDescription>Mandatory Competencies Completion</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-bold">{mandatoryComplete}</p>
            <p className="text-sm text-muted-foreground">of {mandatoryTotal} mandatory competencies</p>
          </div>
          <Progress value={progressPercentage} />
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>{mandatoryComplete} Complete</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span>{mandatoryTotal - mandatoryComplete} Remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="mandatory" className="w-full">
        <TabsList>
          <TabsTrigger value="mandatory">Mandatory ({mandatoryComplete}/{mandatoryTotal})</TabsTrigger>
          <TabsTrigger value="core">Core Competencies</TabsTrigger>
          <TabsTrigger value="optional">Optional Competencies</TabsTrigger>
        </TabsList>

        <TabsContent value="mandatory" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {competencies.map((competency) => {
              const status = getLevelStatus(competency.current_level, competency.required_level || 0);
              return (
                <Card key={competency.id} className="relative">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{competency.competency_name}</CardTitle>
                        <CardDescription className="mt-1">
                          Required: Level {competency.required_level} | Current: Level {competency.current_level}
                        </CardDescription>
                      </div>
                      {status === "complete" ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : status === "in-progress" ? (
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-semibold">
                          {competency.current_level}/{competency.required_level}
                        </span>
                      </div>
                      <Progress value={(competency.current_level / (competency.required_level || 1)) * 100} />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge className={getLevelBadge(competency.current_level)}>
                        Level {competency.current_level}
                      </Badge>
                      <Badge variant="outline">{competency.evidence_count} evidence entries</Badge>
                      {competency.supervisor_signoff && (
                        <Badge variant="default" className="bg-green-600">
                          Supervisor ✓
                        </Badge>
                      )}
                      {competency.counsellor_signoff && (
                        <Badge variant="default" className="bg-blue-600">
                          Counsellor ✓
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/experience?competency=${competency.id}`}>View Evidence</Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link href={`/competencies/${competency.id}`}>Manage</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="core">
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Core competencies will be loaded based on your selected pathway: {userPathway || "Not set"}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optional">
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Optional competencies can be added based on your career goals and pathway requirements.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

