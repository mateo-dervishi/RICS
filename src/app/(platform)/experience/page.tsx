"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getSupabaseWithUserId } from "@/lib/user-helpers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { mandatoryCompetencies } from "@/data/competencies";
import { Plus, Calendar, Filter, Search } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const experienceSchema = z.object({
  entry_date: z.string().min(1, "Date is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  competencies: z.array(z.string()).min(1, "Select at least one competency"),
  level: z.coerce.number().min(1).max(3),
  hours: z.coerce.number().min(0).optional(),
  project_id: z.string().optional()
});

type ExperienceForm = z.infer<typeof experienceSchema>;

interface ExperienceEntry {
  id: string;
  entry_date: string;
  description: string;
  competencies: string[];
  level: number;
  hours: number;
  project_id?: string;
  project_title?: string;
  created_at: string;
}

export default function ExperiencePage() {
  const searchParams = useSearchParams();
  const [entries, setEntries] = useState<ExperienceEntry[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCompetency, setFilterCompetency] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<ExperienceForm>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      competencies: [],
      level: 1,
      hours: 0
    }
  });

  const selectedCompetencies = watch("competencies");

  useEffect(() => {
    loadData();
    const competencyParam = searchParams.get("competency");
    if (competencyParam) {
      setFilterCompetency(competencyParam);
      setIsDialogOpen(true);
      setValue("competencies", [competencyParam]);
    }
  }, [searchParams]);

  const loadData = async () => {
    try {
      const { supabase, userId } = await getSupabaseWithUserId();

      // Load experience entries
      const { data: experienceData } = await supabase
        .from("experience_entries")
        .select("*, projects(title)")
        .eq("user_id", userId)
        .order("entry_date", { ascending: false });

      if (experienceData) {
        setEntries(
          experienceData.map((e: any) => ({
            ...e,
            project_title: e.projects?.title
          }))
        );
      }

      // Load projects
      const { data: projectsData } = await supabase.from("projects").select("*").eq("user_id", userId);
      if (projectsData) setProjects(projectsData);
    } catch (error: any) {
      // Supabase may not be configured - that's okay
      console.log("Failed to load experience entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ExperienceForm) => {
    try {
      const { supabase, userId } = await getSupabaseWithUserId();

      const { error } = await supabase.from("experience_entries").insert({
        user_id: userId,
        entry_date: data.entry_date,
        description: data.description,
        competencies: data.competencies,
        level: data.level,
        hours: data.hours || 0,
        project_id: data.project_id || null
      });

      if (error) throw error;

      // Update user competencies
      for (const compId of data.competencies) {
        const { data: existing } = await supabase
          .from("user_competencies")
          .select("*")
          .eq("user_id", userId)
          .eq("competency_id", compId)
          .single();

        if (existing) {
          await supabase
            .from("user_competencies")
            .update({
              current_level: Math.max(existing.current_level, data.level),
              evidence_count: existing.evidence_count + 1
            })
            .eq("id", existing.id);
        } else {
          await supabase.from("user_competencies").insert({
            user_id: userId,
            competency_id: compId,
            current_level: data.level,
            achieved_level: data.level,
            evidence_count: 1
          });
        }
      }

      toast.success("Experience entry added successfully!");
      reset();
      setIsDialogOpen(false);
      loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to save experience entry");
    }
  };

  const toggleCompetency = (compId: string) => {
    const current = selectedCompetencies || [];
    const updated = current.includes(compId) ? current.filter((id) => id !== compId) : [...current, compId];
    setValue("competencies", updated);
  };

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch = entry.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterCompetency || entry.competencies.includes(filterCompetency);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading experience entries...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Experience Diary</h1>
          <p className="text-muted-foreground">Log your daily experiences and link them to competencies</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Experience Entry</DialogTitle>
              <DialogDescription>Record your experience and link it to relevant competencies</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="entry_date">Date *</Label>
                  <Input id="entry_date" type="date" {...register("entry_date")} />
                  {errors.entry_date && <p className="text-sm text-destructive">{errors.entry_date.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hours">Hours</Label>
                  <Input id="hours" type="number" step="0.5" min="0" {...register("hours")} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project_id">Project (Optional)</Label>
                <Select onValueChange={(value) => setValue("project_id", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Competencies *</Label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-md p-2">
                  {mandatoryCompetencies.map((comp) => (
                    <div key={comp.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={comp.id}
                        checked={selectedCompetencies?.includes(comp.id) || false}
                        onChange={() => toggleCompetency(comp.id)}
                        className="rounded"
                      />
                      <label htmlFor={comp.id} className="text-sm cursor-pointer">
                        {comp.name}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.competencies && <p className="text-sm text-destructive">{errors.competencies.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Competency Level *</Label>
                <Select onValueChange={(value) => setValue("level", parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Level 1: Knowledge and understanding</SelectItem>
                    <SelectItem value="2">Level 2: Application of knowledge</SelectItem>
                    <SelectItem value="3">Level 3: Reasoned advice and depth</SelectItem>
                  </SelectContent>
                </Select>
                {errors.level && <p className="text-sm text-destructive">{errors.level.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your experience, what you did, what you learned, and how it demonstrates the competency..."
                  rows={6}
                  {...register("description")}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Entry</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Experience Entries</CardTitle>
              <CardDescription>Total: {filteredEntries.length} entries</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={filterCompetency} onValueChange={setFilterCompetency}>
                <SelectTrigger className="w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by competency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All competencies</SelectItem>
                  {mandatoryCompetencies.map((comp) => (
                    <SelectItem key={comp.id} value={comp.id}>
                      {comp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEntries.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">No experience entries found. Add your first entry to get started.</div>
            ) : (
              filteredEntries.map((entry) => (
                <Card key={entry.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">{new Date(entry.entry_date).toLocaleDateString()}</span>
                          {entry.hours > 0 && (
                            <Badge variant="outline">{entry.hours} hours</Badge>
                          )}
                          <Badge>Level {entry.level}</Badge>
                        </div>
                        {entry.project_title && (
                          <Badge variant="secondary">Project: {entry.project_title}</Badge>
                        )}
                        <p className="text-sm">{entry.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {entry.competencies.map((compId) => {
                            const comp = mandatoryCompetencies.find((c) => c.id === compId);
                            return comp ? (
                              <Badge key={compId} variant="outline">
                                {comp.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
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
  );
}

