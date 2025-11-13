"use client";

import { useEffect, useState } from "react";
import { getSupabaseWithUserId } from "@/lib/user-helpers";
import { useUser } from "@/lib/user-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Target, CheckCircle2, Clock } from "lucide-react";
import { mandatoryCompetencies } from "@/data/competencies";
import Link from "next/link";
import { format, differenceInDays } from "date-fns";

interface DashboardStats {
  competenciesComplete: number;
  competenciesTotal: number;
  experienceDays: number;
  cpdHours: number;
  cpdTarget: number;
  daysUntilSubmission: number;
  readinessScore: number;
}

export function EnhancedDashboard() {
  const { user } = useUser();
  const [stats, setStats] = useState<DashboardStats>({
    competenciesComplete: 0,
    competenciesTotal: mandatoryCompetencies.length,
    experienceDays: 0,
    cpdHours: 0,
    cpdTarget: 48,
    daysUntilSubmission: 0,
    readinessScore: 0
  });
  const [loading, setLoading] = useState(true);
  const [targetDate, setTargetDate] = useState<Date | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { supabase, userId } = await getSupabaseWithUserId();

      // Get user profile from local storage or Supabase
      if (user?.targetSubmissionDate) {
        const target = new Date(user.targetSubmissionDate);
        setTargetDate(target);
        const daysUntil = differenceInDays(target, new Date());
        setStats((prev) => ({ ...prev, daysUntilSubmission: daysUntil }));
      } else {
        try {
          const { data: userData } = await supabase
            .from("users")
            .select("target_submission_date, pathway, metadata")
            .eq("id", userId)
            .single();

          if (userData?.target_submission_date) {
            const target = new Date(userData.target_submission_date);
            setTargetDate(target);
            const daysUntil = differenceInDays(target, new Date());
            setStats((prev) => ({ ...prev, daysUntilSubmission: daysUntil }));
          }
        } catch (e) {
          // Supabase not available
        }
      }

      // Load competencies
      const { data: userCompetencies } = await supabase
        .from("user_competencies")
        .select("current_level, competency_id")
        .eq("user_id", userId);

      if (userCompetencies) {
        const complete = userCompetencies.filter((uc) => {
          const comp = mandatoryCompetencies.find((c) => c.id === uc.competency_id);
          return comp && uc.current_level >= comp.requiredLevel;
        }).length;
        setStats((prev) => ({
          ...prev,
          competenciesComplete: complete
        }));
      }

      // Load experience entries count
      const { data: experienceData } = await supabase
        .from("experience_entries")
        .select("entry_date", { count: "exact" })
        .eq("user_id", userId);

      if (experienceData) {
        const uniqueDays = new Set(experienceData.map((e) => e.entry_date)).size;
        setStats((prev) => ({ ...prev, experienceDays: uniqueDays }));
      }

      // Load CPD hours
      const currentYear = new Date().getFullYear();
      const { data: cpdTracker } = await supabase
        .from("cpd_annual_tracker")
        .select("total_hours")
        .eq("user_id", userId)
        .eq("year", currentYear)
        .single();

      if (cpdTracker) {
        setStats((prev) => ({ ...prev, cpdHours: cpdTracker.total_hours || 0 }));
      }

      // Calculate readiness score
      const competencyProgress = stats.competenciesComplete / stats.competenciesTotal;
      const experienceProgress = Math.min(1, stats.experienceDays / 400); // 400 days target
      const cpdProgress = Math.min(1, stats.cpdHours / stats.cpdTarget);
      const readinessScore = Math.round(((competencyProgress + experienceProgress + cpdProgress) / 3) * 100);

      setStats((prev) => ({ ...prev, readinessScore }));
    } catch (error: any) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getReadinessColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getReadinessBadge = (score: number) => {
    if (score >= 80) return { label: "Ready", variant: "default" as const, className: "bg-green-600" };
    if (score >= 60) return { label: "On Track", variant: "default" as const, className: "bg-yellow-600" };
    return { label: "Needs Work", variant: "warning" as const };
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading dashboard...</div>;
  }

  const readinessBadge = getReadinessBadge(stats.readinessScore);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Track your APC journey progress</p>
        </div>
        {targetDate && (
          <div className="text-right">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              <span>Target Submission: {format(targetDate, "MMM dd, yyyy")}</span>
            </div>
            <div className={`text-lg font-semibold ${stats.daysUntilSubmission < 90 ? "text-red-600" : ""}`}>
              {stats.daysUntilSubmission} days remaining
            </div>
          </div>
        )}
      </div>

      {/* Readiness Score */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Readiness Score</CardTitle>
              <CardDescription>Overall APC submission readiness</CardDescription>
            </div>
            <Badge variant={readinessBadge.variant} className={readinessBadge.className}>
              {readinessBadge.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-baseline justify-between">
              <span className={`text-4xl font-bold ${getReadinessColor(stats.readinessScore)}`}>
                {stats.readinessScore}%
              </span>
              <span className="text-sm text-muted-foreground">out of 100%</span>
            </div>
            <Progress value={stats.readinessScore} className="h-3" />
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Competencies</p>
                <p className="font-semibold">
                  {stats.competenciesComplete}/{stats.competenciesTotal}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Experience Days</p>
                <p className="font-semibold">{stats.experienceDays}/400</p>
              </div>
              <div>
                <p className="text-muted-foreground">CPD Hours</p>
                <p className="font-semibold">
                  {stats.cpdHours.toFixed(1)}/{stats.cpdTarget}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Competency Coverage</CardTitle>
            <CardDescription>Mandatory competencies progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline justify-between">
              <p className="text-3xl font-bold">{stats.competenciesComplete}</p>
              <p className="text-sm text-muted-foreground">of {stats.competenciesTotal}</p>
            </div>
            <Progress value={(stats.competenciesComplete / stats.competenciesTotal) * 100} />
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href="/competencies">View Competencies →</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Experience Diary</CardTitle>
            <CardDescription>Structured training requirement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline justify-between">
              <p className="text-3xl font-bold">{stats.experienceDays}</p>
              <p className="text-sm text-muted-foreground">days logged</p>
            </div>
            <Progress value={Math.min(100, (stats.experienceDays / 400) * 100)} />
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href="/experience">View Experience →</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CPD Compliance</CardTitle>
            <CardDescription>Annual CPD requirement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline justify-between">
              <p className="text-3xl font-bold">{stats.cpdHours.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">of {stats.cpdTarget} hrs</p>
            </div>
            <Progress value={Math.min(100, (stats.cpdHours / stats.cpdTarget) * 100)} />
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href="/cpd">View CPD →</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and next steps</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" asChild>
              <Link href="/experience">
                <Clock className="mr-2 h-4 w-4" />
                Log Experience
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/case-studies">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Case Study
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/summary-of-experience">
                <Calendar className="mr-2 h-4 w-4" />
                Write Summary
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/documents">
                <Target className="mr-2 h-4 w-4" />
                Documents
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

