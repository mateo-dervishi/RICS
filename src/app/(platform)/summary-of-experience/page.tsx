"use client";

import { useEffect, useState } from "react";
import { getSupabaseWithUserId } from "@/lib/user-helpers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { mandatoryCompetencies } from "@/data/competencies";
import { Save, Sparkles, FileText, Edit, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getAISuggestions } from "@/lib/ai";
import { useState } from "react";

const summarySchema = z.object({
  competency_id: z.string().min(1, "Competency is required"),
  content: z.string().min(100, "Content must be at least 100 characters"),
  level: z.coerce.number().min(1).max(3)
});

type SummaryForm = z.infer<typeof summarySchema>;

interface Summary {
  id: string;
  competency_id: string;
  competency_name: string;
  content: string;
  word_count: number;
  level: number;
  version: number;
  status: string;
}

export default function SummaryOfExperiencePage() {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSummary, setEditingSummary] = useState<Summary | null>(null);
  const [selectedCompetency, setSelectedCompetency] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<SummaryForm>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      level: 1
    }
  });

  const content = watch("content");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { supabase, userId } = await getSupabaseWithUserId();

      const { data: summariesData } = await supabase
        .from("summary_of_experience")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (summariesData) {
        setSummaries(summariesData);
      }
    } catch (error: any) {
      toast.error("Failed to load summaries");
    } finally {
      setLoading(false);
    }
  };

  const calculateWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter((word) => word.length > 0).length;
  };

  const getTargetWordCount = (level: number) => {
    if (level === 1) return 1500; // Mandatory competencies
    return 3000; // Technical competencies
  };

  const onSubmit = async (data: SummaryForm) => {
    try {
      const { supabase, userId } = await getSupabaseWithUserId();

      const wordCount = calculateWordCount(data.content);
      const competency = mandatoryCompetencies.find((c) => c.id === data.competency_id);
      const targetWords = getTargetWordCount(data.level);

      if (editingSummary) {
        const { error } = await supabase
          .from("summary_of_experience")
          .update({
            content: data.content,
            word_count: wordCount,
            level: data.level,
            updated_at: new Date().toISOString()
          })
          .eq("id", editingSummary.id);

        if (error) throw error;
        toast.success("Summary updated successfully!");
      } else {
        const { error } = await supabase.from("summary_of_experience").insert({
          user_id: userId,
          competency_id: data.competency_id,
          competency_name: competency?.name || "",
          content: data.content,
          word_count: wordCount,
          level: data.level,
          version: 1,
          status: "draft"
        });

        if (error) throw error;
        toast.success("Summary created successfully!");
      }

      reset();
      setIsDialogOpen(false);
      setEditingSummary(null);
      loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to save summary");
    }
  };

  const handleEdit = (summary: Summary) => {
    setEditingSummary(summary);
    setValue("competency_id", summary.competency_id);
    setValue("content", summary.content);
    setValue("level", summary.level);
    setSelectedCompetency(summary.competency_id);
    setIsDialogOpen(true);
  };

  const handleAISuggestions = async () => {
    const currentContent = watch("content");
    const currentCompetency = watch("competency_id");
    const currentLevel = watch("level");

    if (!currentContent || currentContent.length < 50) {
      toast.error("Please write some content first before getting AI suggestions");
      return;
    }

    if (!currentCompetency) {
      toast.error("Please select a competency first");
      return;
    }

    setAiLoading(true);
    try {
      const competency = mandatoryCompetencies.find((c) => c.id === currentCompetency);
      const suggestions = await getAISuggestions({
        type: "summary-suggestions",
        content: currentContent,
        competency: competency?.name || currentCompetency,
        level: currentLevel || 1
      });
      setAiSuggestions(suggestions);
      toast.success("AI suggestions generated!");
    } catch (error: any) {
      toast.error(error.message || "Failed to get AI suggestions. Make sure OPENAI_API_KEY is configured.");
    } finally {
      setAiLoading(false);
    }
  };

  const getLevelGuidance = (level: number) => {
    const guidance = {
      1: "Focus on knowledge and awareness statements. Demonstrate understanding of concepts and principles.",
      2: "Emphasize practical experience and application. Show how you've applied knowledge in real situations.",
      3: "Highlight advisory capacity and evaluation. Demonstrate reasoned advice and depth of technical knowledge."
    };
    return guidance[level as keyof typeof guidance] || guidance[1];
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading summaries...</div>;
  }

  const wordCount = calculateWordCount(content || "");
  const selectedLevel = watch("level") || 1;
  const targetWords = getTargetWordCount(selectedLevel);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Summary of Experience</h1>
          <p className="text-muted-foreground">Write competency summaries for your APC submission</p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingSummary(null);
              reset();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              New Summary
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingSummary ? "Edit Summary" : "New Summary of Experience"}</DialogTitle>
              <DialogDescription>
                Write a comprehensive summary demonstrating your competency at the required level
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="competency_id">Competency *</Label>
                  <Select
                    value={selectedCompetency}
                    onValueChange={(value) => {
                      setSelectedCompetency(value);
                      setValue("competency_id", value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select competency" />
                    </SelectTrigger>
                    <SelectContent>
                      {mandatoryCompetencies.map((comp) => (
                        <SelectItem key={comp.id} value={comp.id}>
                          {comp.name} (Level {comp.requiredLevel})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.competency_id && (
                    <p className="text-sm text-destructive">{errors.competency_id.message}</p>
                  )}
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
              </div>

              <div className="rounded-lg border p-4 bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Word Count</span>
                  <Badge variant={wordCount >= targetWords ? "default" : "outline"}>
                    {wordCount} / {targetWords} words
                  </Badge>
                </div>
                <Progress value={Math.min(100, (wordCount / targetWords) * 100)} />
                <p className="text-xs text-muted-foreground mt-2">{getLevelGuidance(selectedLevel)}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="content">Summary Content *</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleAISuggestions}
                    disabled={aiLoading}
                  >
                    {aiLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        AI Suggestions
                      </>
                    )}
                  </Button>
                </div>
                <Textarea
                  id="content"
                  rows={12}
                  placeholder="Write your summary here. Use SMART objectives and provide specific examples from your experience..."
                  {...register("content")}
                />
                {errors.content && <p className="text-sm text-destructive">{errors.content.message}</p>}
                {aiSuggestions && (
                  <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm font-semibold mb-2">AI Suggestions:</p>
                    <p className="text-sm whitespace-pre-wrap">{aiSuggestions}</p>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Tip: Include specific examples, outcomes, and demonstrate how you've met the competency requirements.
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Save Summary
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {summaries.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-8 text-center text-muted-foreground">
              No summaries yet. Create your first summary to get started.
            </CardContent>
          </Card>
        ) : (
          summaries.map((summary) => {
            const targetWords = getTargetWordCount(summary.level);
            return (
              <Card key={summary.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{summary.competency_name}</CardTitle>
                    <Badge variant={summary.status === "approved" ? "default" : "outline"}>
                      {summary.status}
                    </Badge>
                  </div>
                  <CardDescription>Level {summary.level} • Version {summary.version}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Word Count</span>
                      <Badge variant={summary.word_count >= targetWords ? "default" : "outline"}>
                        {summary.word_count} / {targetWords}
                      </Badge>
                    </div>
                    <Progress value={Math.min(100, (summary.word_count / targetWords) * 100)} />
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">{summary.content}</p>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(summary)} className="w-full">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Summary
                  </Button>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

