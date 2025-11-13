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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { mandatoryCompetencies } from "@/data/competencies";
import { Plus, Play, Star, MessageSquare, Clock } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const interviewSchema = z.object({
  question: z.string().min(10, "Question must be at least 10 characters"),
  answer: z.string().min(50, "Answer must be at least 50 characters"),
  competency_area: z.string().optional(),
  level: z.coerce.number().min(1).max(3).optional(),
  question_type: z.enum(["competency", "ethics", "technical", "scenario"]).optional()
});

type InterviewForm = z.infer<typeof interviewSchema>;

interface InterviewPrep {
  id: string;
  question: string;
  answer: string;
  competency_area?: string;
  level?: number;
  question_type?: string;
  star_format?: any;
  feedback?: string;
  rating?: number;
  created_at: string;
}

const sampleQuestions = [
  {
    question: "Tell me about a time when you had to make an ethical decision in your professional practice.",
    type: "ethics",
    level: 3,
    competency: "ethics"
  },
  {
    question: "Describe a project where you applied your technical knowledge to solve a complex problem.",
    type: "technical",
    level: 2,
    competency: "technical"
  },
  {
    question: "How do you ensure effective communication with clients throughout a project?",
    type: "competency",
    level: 2,
    competency: "communication"
  }
];

export default function InterviewPage() {
  const [prepItems, setPrepItems] = useState<InterviewPrep[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [isPracticing, setIsPracticing] = useState(false);
  const [practiceTime, setPracticeTime] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<InterviewForm>({
    resolver: zodResolver(interviewSchema)
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPracticing) {
      interval = setInterval(() => {
        setPracticeTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPracticing]);

  const loadData = async () => {
    try {
      const { supabase, userId } = await getSupabaseWithUserId();

      const { data: prepData } = await supabase
        .from("interview_prep")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (prepData) {
        setPrepItems(prepData);
      }
    } catch (error: any) {
      toast.error("Failed to load interview prep");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: InterviewForm) => {
    try {
      const { supabase, userId } = await getSupabaseWithUserId();

      const { error } = await supabase.from("interview_prep").insert({
        user_id: userId,
        question: data.question,
        answer: data.answer,
        competency_area: data.competency_area,
        level: data.level,
        question_type: data.question_type
      });

      if (error) throw error;

      toast.success("Interview prep saved!");
      reset();
      setIsDialogOpen(false);
      loadData();
    } catch (error: any) {
      toast.error("Failed to save interview prep");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startPractice = (question: any) => {
    setSelectedQuestion(question);
    setIsPracticing(true);
    setPracticeTime(0);
  };

  const stopPractice = () => {
    setIsPracticing(false);
    if (practiceTime >= 600) {
      toast.success("Great! You completed the 10-minute presentation practice.");
    } else {
      toast.info(`Practice session: ${formatTime(practiceTime)}`);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading interview prep...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Interview Preparation</h1>
          <p className="text-muted-foreground">Prepare for your APC final assessment interview</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Practice Question
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Interview Practice Question</DialogTitle>
              <DialogDescription>Practice answering common APC interview questions</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question_type">Question Type</Label>
                <Select onValueChange={(value) => setValue("question_type", value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="competency">Competency-based</SelectItem>
                    <SelectItem value="ethics">Ethics & Professionalism</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="scenario">Scenario-based</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="question">Question *</Label>
                <Textarea id="question" rows={3} {...register("question")} />
                {errors.question && <p className="text-sm text-destructive">{errors.question.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="answer">Your Answer (STAR Format) *</Label>
                <Textarea
                  id="answer"
                  rows={8}
                  placeholder="Situation: ... Task: ... Action: ... Result: ..."
                  {...register("answer")}
                />
                {errors.answer && <p className="text-sm text-destructive">{errors.answer.message}</p>}
                <p className="text-xs text-muted-foreground">
                  Use the STAR technique: Situation, Task, Action, Result
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="competency_area">Competency Area</Label>
                  <Select onValueChange={(value) => setValue("competency_area", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select competency" />
                    </SelectTrigger>
                    <SelectContent>
                      {mandatoryCompetencies.map((comp) => (
                        <SelectItem key={comp.id} value={comp.id}>
                          {comp.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Select onValueChange={(value) => setValue("level", parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Level 1</SelectItem>
                      <SelectItem value="2">Level 2</SelectItem>
                      <SelectItem value="3">Level 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Question Bank</CardTitle>
            <CardDescription>Practice questions organized by type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {sampleQuestions.map((q, idx) => (
              <div key={idx} className="p-3 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline">{q.type}</Badge>
                  <Badge>Level {q.level}</Badge>
                </div>
                <p className="text-sm mb-2">{q.question}</p>
                <Button size="sm" variant="outline" onClick={() => startPractice(q)}>
                  <Play className="mr-2 h-3 w-3" />
                  Practice
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Presentation Practice</CardTitle>
            <CardDescription>10-minute case study presentation timer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isPracticing ? (
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold">{formatTime(practiceTime)}</div>
                <div className="text-sm text-muted-foreground">
                  {selectedQuestion?.question || "Practice your presentation"}
                </div>
                <div className="flex gap-2 justify-center">
                  <Button onClick={stopPractice}>Stop Practice</Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Select a question to start practicing your 10-minute presentation
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Practice Answers</CardTitle>
          <CardDescription>Review and improve your interview responses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {prepItems.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">No practice answers yet.</div>
            ) : (
              prepItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold">{item.question}</p>
                          <div className="flex gap-2 mt-2">
                            {item.question_type && (
                              <Badge variant="outline">{item.question_type}</Badge>
                            )}
                            {item.level && <Badge>Level {item.level}</Badge>}
                            {item.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm">{item.rating}/5</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm whitespace-pre-wrap">{item.answer}</p>
                      </div>
                      {item.feedback && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <p className="text-sm font-semibold mb-1">Feedback:</p>
                          <p className="text-sm">{item.feedback}</p>
                        </div>
                      )}
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

