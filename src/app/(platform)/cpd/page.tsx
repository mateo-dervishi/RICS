"use client";

import { useEffect, useState } from "react";
import { getSupabaseWithUserId } from "@/lib/user-helpers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { mandatoryCompetencies } from "@/data/competencies";
import { Plus, Calendar, FileText, Award } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const cpdSchema = z.object({
  activity_date: z.string().min(1, "Date is required"),
  type: z.enum(["formal", "informal", "structured"]),
  hours: z.coerce.number().min(0.5, "Hours must be at least 0.5"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  competency_links: z.array(z.string()).optional(),
  certificate_url: z.string().url().optional().or(z.literal(""))
});

type CPDForm = z.infer<typeof cpdSchema>;

interface CPDActivity {
  id: string;
  activity_date: string;
  type: string;
  hours: number;
  description: string;
  competency_links: string[];
  certificate_url?: string;
  created_at: string;
}

export default function CPDPage() {
  const [activities, setActivities] = useState<CPDActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [annualTracker, setAnnualTracker] = useState({
    total_hours: 0,
    formal_hours: 0,
    informal_hours: 0,
    structured_hours: 0,
    target_hours: 48
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<CPDForm>({
    resolver: zodResolver(cpdSchema),
    defaultValues: {
      competency_links: [],
      type: "formal"
    }
  });

  const selectedCompetencies = watch("competency_links");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { supabase, userId } = await getSupabaseWithUserId();

      const currentYear = new Date().getFullYear();

      // Load CPD activities
      const { data: activitiesData } = await supabase
        .from("cpd_activities")
        .select("*")
        .eq("user_id", userId)
        .order("activity_date", { ascending: false });

      if (activitiesData) {
        setActivities(activitiesData);
      }

      // Load or create annual tracker
      const { data: trackerData } = await supabase
        .from("cpd_annual_tracker")
        .select("*")
        .eq("user_id", userId)
        .eq("year", currentYear)
        .single();

      if (trackerData) {
        setAnnualTracker(trackerData);
      } else {
        // Calculate from activities
        const yearActivities = activitiesData?.filter(
          (a) => new Date(a.activity_date).getFullYear() === currentYear
        ) || [];
        const totals = yearActivities.reduce(
          (acc, activity) => {
            acc.total_hours += activity.hours || 0;
            if (activity.type === "formal") acc.formal_hours += activity.hours || 0;
            if (activity.type === "informal") acc.informal_hours += activity.hours || 0;
            if (activity.type === "structured") acc.structured_hours += activity.hours || 0;
            return acc;
          },
          { total_hours: 0, formal_hours: 0, informal_hours: 0, structured_hours: 0 }
        );

        // Create tracker
        const { data: newTracker } = await supabase
          .from("cpd_annual_tracker")
          .insert({
            user_id: userId,
            year: currentYear,
            ...totals,
            target_hours: 48
          })
          .select()
          .single();

        if (newTracker) setAnnualTracker(newTracker);
      }
    } catch (error: any) {
      toast.error("Failed to load CPD activities");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: CPDForm) => {
    try {
      const { supabase, userId } = await getSupabaseWithUserId();

      const { error } = await supabase.from("cpd_activities").insert({
        user_id: userId,
        activity_date: data.activity_date,
        type: data.type,
        hours: data.hours,
        description: data.description,
        competency_links: data.competency_links || [],
        certificate_url: data.certificate_url || null
      });

      if (error) throw error;

      // Update annual tracker
      const activityYear = new Date(data.activity_date).getFullYear();
      const currentYear = new Date().getFullYear();

      if (activityYear === currentYear) {
        const { data: tracker } = await supabase
          .from("cpd_annual_tracker")
          .select("*")
          .eq("user_id", userId)
          .eq("year", currentYear)
          .single();

        if (tracker) {
          const updates: any = {
            total_hours: tracker.total_hours + data.hours
          };
          if (data.type === "formal") updates.formal_hours = tracker.formal_hours + data.hours;
          if (data.type === "informal") updates.informal_hours = tracker.informal_hours + data.hours;
          if (data.type === "structured") updates.structured_hours = tracker.structured_hours + data.hours;

          await supabase.from("cpd_annual_tracker").update(updates).eq("id", tracker.id);
        }
      }

      toast.success("CPD activity added successfully!");
      reset();
      setIsDialogOpen(false);
      loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to save CPD activity");
    }
  };

  const toggleCompetency = (compId: string) => {
    const current = selectedCompetencies || [];
    const updated = current.includes(compId) ? current.filter((id) => id !== compId) : [...current, compId];
    setValue("competency_links", updated);
  };

  const progressPercentage = (annualTracker.total_hours / annualTracker.target_hours) * 100;

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading CPD activities...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">CPD Tracker</h1>
          <p className="text-muted-foreground">Track your Continuing Professional Development activities</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add CPD Activity
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add CPD Activity</DialogTitle>
              <DialogDescription>Log your CPD activities and link them to competencies</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="activity_date">Activity Date *</Label>
                  <Input id="activity_date" type="date" {...register("activity_date")} />
                  {errors.activity_date && <p className="text-sm text-destructive">{errors.activity_date.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Activity Type *</Label>
                  <Select onValueChange={(value) => setValue("type", value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="formal">Formal CPD</SelectItem>
                      <SelectItem value="informal">Informal CPD</SelectItem>
                      <SelectItem value="structured">Structured CPD</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="hours">Hours *</Label>
                  <Input id="hours" type="number" step="0.5" min="0.5" {...register("hours")} />
                  {errors.hours && <p className="text-sm text-destructive">{errors.hours.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="certificate_url">Certificate URL (Optional)</Label>
                  <Input id="certificate_url" type="url" placeholder="https://..." {...register("certificate_url")} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Link to Competencies (Optional)</Label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-md p-2">
                  {mandatoryCompetencies.map((comp) => (
                    <div key={comp.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`cpd-${comp.id}`}
                        checked={selectedCompetencies?.includes(comp.id) || false}
                        onChange={() => toggleCompetency(comp.id)}
                        className="rounded"
                      />
                      <label htmlFor={`cpd-${comp.id}`} className="text-sm cursor-pointer">
                        {comp.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the CPD activity, what you learned, and how it contributes to your professional development..."
                  rows={4}
                  {...register("description")}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Activity</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Annual Progress</CardTitle>
            <CardDescription>{new Date().getFullYear()} CPD Hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline justify-between">
              <p className="text-3xl font-bold">{annualTracker.total_hours.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">of {annualTracker.target_hours} hours</p>
            </div>
            <Progress value={Math.min(100, progressPercentage)} />
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Formal
                </span>
                <span className="font-semibold">{annualTracker.formal_hours.toFixed(1)} hrs</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Informal
                </span>
                <span className="font-semibold">{annualTracker.informal_hours.toFixed(1)} hrs</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Structured
                </span>
                <span className="font-semibold">{annualTracker.structured_hours.toFixed(1)} hrs</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Your CPD activity log</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">No CPD activities logged yet.</div>
              ) : (
                activities.map((activity) => (
                  <Card key={activity.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">{new Date(activity.activity_date).toLocaleDateString()}</span>
                            <Badge variant="outline">{activity.type}</Badge>
                            <Badge>{activity.hours} hours</Badge>
                          </div>
                          <p className="text-sm">{activity.description}</p>
                          {activity.competency_links && activity.competency_links.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {activity.competency_links.map((compId) => {
                                const comp = mandatoryCompetencies.find((c) => c.id === compId);
                                return comp ? (
                                  <Badge key={compId} variant="secondary" className="text-xs">
                                    {comp.name}
                                  </Badge>
                                ) : null;
                              })}
                            </div>
                          )}
                          {activity.certificate_url && (
                            <a
                              href={activity.certificate_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline flex items-center gap-1"
                            >
                              <FileText className="h-3 w-3" />
                              View Certificate
                            </a>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

