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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";

const caseStudySchema = z.object({
  title: z.string().min(1, "Title is required"),
  project_id: z.string().optional(),
  overview: z.string().min(100, "Overview must be at least 100 characters"),
  role_responsibilities: z.string().min(100, "Role and responsibilities must be at least 100 characters"),
  key_issues: z.string().min(100, "Key issues must be at least 100 characters"),
  problem_solving: z.string().min(100, "Problem solving approach must be at least 100 characters"),
  outcomes: z.string().min(100, "Outcomes must be at least 100 characters"),
  lessons_learned: z.string().min(50, "Lessons learned must be at least 50 characters")
});

type CaseStudyForm = z.infer<typeof caseStudySchema>;

interface CaseStudy {
  id: string;
  title: string;
  overview: string;
  role_responsibilities: string;
  key_issues: string;
  problem_solving: string;
  outcomes: string;
  lessons_learned: string;
  word_count: number;
  status: string;
  project_id?: string;
  project_title?: string;
}

export default function CaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCaseStudy, setEditingCaseStudy] = useState<CaseStudy | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<CaseStudyForm>({
    resolver: zodResolver(caseStudySchema)
  });

  const formValues = watch();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { supabase, userId } = await getSupabaseWithUserId();

      // Load case studies
      const { data: caseStudiesData } = await supabase
        .from("case_studies")
        .select("*, projects(title)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (caseStudiesData) {
        setCaseStudies(
          caseStudiesData.map((cs: any) => ({
            ...cs,
            project_title: cs.projects?.title
          }))
        );
      }

      // Load projects (only those less than 24 months old)
      const twentyFourMonthsAgo = new Date();
      twentyFourMonthsAgo.setMonth(twentyFourMonthsAgo.getMonth() - 24);
      const { data: projectsData } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", userId)
        .gte("end_date", twentyFourMonthsAgo.toISOString().split("T")[0]);
      if (projectsData) setProjects(projectsData);
    } catch (error: any) {
      console.log("Failed to load case studies:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter((word) => word.length > 0).length;
  };

  const totalWordCount = () => {
    const sections = [
      formValues.overview || "",
      formValues.role_responsibilities || "",
      formValues.key_issues || "",
      formValues.problem_solving || "",
      formValues.outcomes || "",
      formValues.lessons_learned || ""
    ];
    return sections.reduce((total, section) => total + calculateWordCount(section), 0);
  };

  const onSubmit = async (data: CaseStudyForm) => {
    try {
      const { supabase, userId } = await getSupabaseWithUserId();

      const wordCount = totalWordCount();

      if (editingCaseStudy) {
        const { error } = await supabase
          .from("case_studies")
          .update({
            title: data.title,
            project_id: data.project_id || null,
            overview: data.overview,
            role_responsibilities: data.role_responsibilities,
            key_issues: data.key_issues,
            problem_solving: data.problem_solving,
            outcomes: data.outcomes,
            lessons_learned: data.lessons_learned,
            word_count: wordCount,
            updated_at: new Date().toISOString()
          })
          .eq("id", editingCaseStudy.id);

        if (error) throw error;
        toast.success("Case study updated successfully!");
      } else {
        const { error } = await supabase.from("case_studies").insert({
          user_id: userId,
          title: data.title,
          project_id: data.project_id || null,
          overview: data.overview,
          role_responsibilities: data.role_responsibilities,
          key_issues: data.key_issues,
          problem_solving: data.problem_solving,
          outcomes: data.outcomes,
          lessons_learned: data.lessons_learned,
          word_count: wordCount,
          status: "draft"
        });

        if (error) throw error;
        toast.success("Case study created successfully!");
      }

      reset();
      setIsDialogOpen(false);
      setEditingCaseStudy(null);
      loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to save case study");
    }
  };

  const handleEdit = (caseStudy: CaseStudy) => {
    setEditingCaseStudy(caseStudy);
    setValue("title", caseStudy.title);
    setValue("project_id", caseStudy.project_id || "");
    setValue("overview", caseStudy.overview);
    setValue("role_responsibilities", caseStudy.role_responsibilities);
    setValue("key_issues", caseStudy.key_issues);
    setValue("problem_solving", caseStudy.problem_solving);
    setValue("outcomes", caseStudy.outcomes);
    setValue("lessons_learned", caseStudy.lessons_learned);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this case study?")) return;

    try {
      const { supabase } = await getSupabaseWithUserId();
      const { error } = await supabase.from("case_studies").delete().eq("id", id);
      if (error) throw error;
      toast.success("Case study deleted");
      loadData();
    } catch (error: any) {
      toast.error("Failed to delete case study");
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading case studies...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Case Study Manager</h1>
          <p className="text-muted-foreground">Create and manage your case studies for APC submission</p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingCaseStudy(null);
              reset();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Case Study
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCaseStudy ? "Edit Case Study" : "New Case Study"}</DialogTitle>
              <DialogDescription>
                Create a comprehensive case study (target: 3,000 words) demonstrating your technical competencies
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Case Study Title *</Label>
                  <Input id="title" {...register("title")} />
                  {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project_id">Linked Project</Label>
                  <Select onValueChange={(value) => setValue("project_id", value)} value={watch("project_id")}>
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
              </div>

              <div className="rounded-lg border p-4 bg-muted/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Word Count</span>
                  <Badge variant={totalWordCount() >= 3000 ? "default" : "outline"}>
                    {totalWordCount()} / 3,000 words
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="overview">Project Overview * (min 100 words)</Label>
                <Textarea id="overview" rows={5} {...register("overview")} />
                <p className="text-xs text-muted-foreground">
                  {calculateWordCount(formValues.overview || "")} words
                </p>
                {errors.overview && <p className="text-sm text-destructive">{errors.overview.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role_responsibilities">Your Role and Responsibilities * (min 100 words)</Label>
                <Textarea id="role_responsibilities" rows={5} {...register("role_responsibilities")} />
                <p className="text-xs text-muted-foreground">
                  {calculateWordCount(formValues.role_responsibilities || "")} words
                </p>
                {errors.role_responsibilities && (
                  <p className="text-sm text-destructive">{errors.role_responsibilities.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="key_issues">Key Issues and Challenges * (min 100 words)</Label>
                <Textarea id="key_issues" rows={5} {...register("key_issues")} />
                <p className="text-xs text-muted-foreground">
                  {calculateWordCount(formValues.key_issues || "")} words
                </p>
                {errors.key_issues && <p className="text-sm text-destructive">{errors.key_issues.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="problem_solving">Problem-Solving Approach * (min 100 words)</Label>
                <Textarea id="problem_solving" rows={5} {...register("problem_solving")} />
                <p className="text-xs text-muted-foreground">
                  {calculateWordCount(formValues.problem_solving || "")} words
                </p>
                {errors.problem_solving && (
                  <p className="text-sm text-destructive">{errors.problem_solving.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="outcomes">Outcomes and Results * (min 100 words)</Label>
                <Textarea id="outcomes" rows={5} {...register("outcomes")} />
                <p className="text-xs text-muted-foreground">
                  {calculateWordCount(formValues.outcomes || "")} words
                </p>
                {errors.outcomes && <p className="text-sm text-destructive">{errors.outcomes.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lessons_learned">Lessons Learned * (min 50 words)</Label>
                <Textarea id="lessons_learned" rows={4} {...register("lessons_learned")} />
                <p className="text-xs text-muted-foreground">
                  {calculateWordCount(formValues.lessons_learned || "")} words
                </p>
                {errors.lessons_learned && (
                  <p className="text-sm text-destructive">{errors.lessons_learned.message}</p>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Case Study</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {caseStudies.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-8 text-center text-muted-foreground">
              No case studies yet. Create your first case study to get started.
            </CardContent>
          </Card>
        ) : (
          caseStudies.map((caseStudy) => (
            <Card key={caseStudy.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{caseStudy.title}</CardTitle>
                  <Badge variant={caseStudy.status === "approved" ? "default" : "outline"}>
                    {caseStudy.status}
                  </Badge>
                </div>
                {caseStudy.project_title && (
                  <CardDescription>Project: {caseStudy.project_title}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Word Count</span>
                  <Badge variant={caseStudy.word_count >= 3000 ? "default" : "outline"}>
                    {caseStudy.word_count} / 3,000
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(caseStudy)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/case-studies/${caseStudy.id}` as any}>View</Link>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(caseStudy.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

