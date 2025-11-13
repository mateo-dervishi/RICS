"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { sectorPathways } from "@/data/pathways";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/lib/user-context";
import { getUserId } from "@/lib/user-context";

const apcRoutes = [
  { value: "structured-12", label: "Structured Training (12 months)" },
  { value: "structured-24", label: "Structured Training (24 months)" },
  { value: "preliminary-review", label: "Preliminary Review" },
  { value: "senior-professional", label: "Senior Professional" },
  { value: "specialist", label: "Specialist" },
  { value: "academic", label: "Academic" }
];

const onboardingSchema = z.object({
  apcRoute: z.string().min(1, "Please select an APC route"),
  pathway: z.string().min(1, "Please select a pathway"),
  ricsEnrollmentDate: z.string().min(1, "Please enter your RICS enrollment date"),
  ricsMembershipNumber: z.string().optional(),
  counsellorName: z.string().optional(),
  counsellorEmail: z.string().email().optional().or(z.literal("")),
  supervisorName: z.string().optional(),
  supervisorEmail: z.string().email().optional().or(z.literal("")),
  targetSubmissionDate: z.string().min(1, "Please enter your target submission date"),
  academicQualification: z.enum(["rics-accredited", "related", "non-related"]),
  yearsOfExperience: z.coerce.number().min(0, "Please enter years of experience")
});

type OnboardingForm = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
  const router = useRouter();
  const { setUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<OnboardingForm>({
    resolver: zodResolver(onboardingSchema)
  });

  const selectedPathway = watch("pathway");

  const onSubmit = async (data: OnboardingForm) => {
    setIsLoading(true);
    try {
      const userId = getUserId();
      
      // Save user profile to local storage via context
      const userProfile = {
        id: userId,
        pathway: data.pathway,
        apcRoute: data.apcRoute,
        ricsEnrollmentDate: data.ricsEnrollmentDate,
        ricsMembershipNumber: data.ricsMembershipNumber,
        counsellorName: data.counsellorName,
        counsellorEmail: data.counsellorEmail,
        supervisorName: data.supervisorName,
        supervisorEmail: data.supervisorEmail,
        targetSubmissionDate: data.targetSubmissionDate,
        academicQualification: data.academicQualification,
        yearsOfExperience: data.yearsOfExperience
      };

      setUser(userProfile);

      // Optionally save to Supabase if available (but don't require it)
      try {
        const supabase = (await import("@/lib/supabase/browser")).createBrowserSupabaseClient();
        await supabase.from("users").upsert({
          id: userId,
          current_level: "associate",
          target_level: "member",
          pathway: data.pathway,
          metadata: userProfile
        });
      } catch (dbError) {
        // Supabase not available or not configured - that's okay
        console.log("Supabase not available, using local storage only");
      }

      toast.success("Profile setup complete! Welcome to your APC journey.");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to save profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
          <CardDescription>Set up your MRICS APC journey profile</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={currentStep.toString()} onValueChange={(v) => setCurrentStep(parseInt(v))}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="1">APC Details</TabsTrigger>
                <TabsTrigger value="2">Pathway & Qualifications</TabsTrigger>
                <TabsTrigger value="3">Support Team</TabsTrigger>
              </TabsList>

              <TabsContent value="1" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apcRoute">APC Route *</Label>
                  <Select onValueChange={(value) => setValue("apcRoute", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your APC route" />
                    </SelectTrigger>
                    <SelectContent>
                      {apcRoutes.map((route) => (
                        <SelectItem key={route.value} value={route.value}>
                          {route.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.apcRoute && <p className="text-sm text-destructive">{errors.apcRoute.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ricsEnrollmentDate">RICS Enrollment Date *</Label>
                  <Input
                    id="ricsEnrollmentDate"
                    type="date"
                    {...register("ricsEnrollmentDate")}
                    disabled={isLoading}
                  />
                  {errors.ricsEnrollmentDate && <p className="text-sm text-destructive">{errors.ricsEnrollmentDate.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ricsMembershipNumber">RICS Membership Number</Label>
                  <Input
                    id="ricsMembershipNumber"
                    placeholder="Optional"
                    {...register("ricsMembershipNumber")}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetSubmissionDate">Target Submission Date *</Label>
                  <Input
                    id="targetSubmissionDate"
                    type="date"
                    {...register("targetSubmissionDate")}
                    disabled={isLoading}
                  />
                  {errors.targetSubmissionDate && <p className="text-sm text-destructive">{errors.targetSubmissionDate.message}</p>}
                </div>

                <Button type="button" onClick={() => setCurrentStep(2)} className="w-full">
                  Next: Pathway & Qualifications
                </Button>
              </TabsContent>

              <TabsContent value="2" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pathway">Sector Pathway *</Label>
                  <Select onValueChange={(value) => setValue("pathway", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your sector pathway" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectorPathways.map((pathway) => (
                        <SelectItem key={pathway.id} value={pathway.id}>
                          {pathway.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.pathway && <p className="text-sm text-destructive">{errors.pathway.message}</p>}
                  {selectedPathway && (
                    <p className="text-sm text-muted-foreground">
                      {sectorPathways.find((p) => p.id === selectedPathway)?.description}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="academicQualification">Academic Qualification *</Label>
                  <Select onValueChange={(value) => setValue("academicQualification", value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select qualification type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rics-accredited">RICS Accredited Degree</SelectItem>
                      <SelectItem value="related">Related Degree</SelectItem>
                      <SelectItem value="non-related">Non-Related Degree</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.academicQualification && <p className="text-sm text-destructive">{errors.academicQualification.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearsOfExperience">Years of Relevant Experience *</Label>
                  <Input
                    id="yearsOfExperience"
                    type="number"
                    min="0"
                    placeholder="0"
                    {...register("yearsOfExperience")}
                    disabled={isLoading}
                  />
                  {errors.yearsOfExperience && <p className="text-sm text-destructive">{errors.yearsOfExperience.message}</p>}
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
                    Back
                  </Button>
                  <Button type="button" onClick={() => setCurrentStep(3)} className="flex-1">
                    Next: Support Team
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="3" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="counsellorName">Counsellor Name</Label>
                  <Input
                    id="counsellorName"
                    placeholder="Optional"
                    {...register("counsellorName")}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="counsellorEmail">Counsellor Email</Label>
                  <Input
                    id="counsellorEmail"
                    type="email"
                    placeholder="counsellor@example.com"
                    {...register("counsellorEmail")}
                    disabled={isLoading}
                  />
                  {errors.counsellorEmail && <p className="text-sm text-destructive">{errors.counsellorEmail.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supervisorName">Supervisor Name</Label>
                  <Input
                    id="supervisorName"
                    placeholder="Optional"
                    {...register("supervisorName")}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supervisorEmail">Supervisor Email</Label>
                  <Input
                    id="supervisorEmail"
                    type="email"
                    placeholder="supervisor@example.com"
                    {...register("supervisorEmail")}
                    disabled={isLoading}
                  />
                  {errors.supervisorEmail && <p className="text-sm text-destructive">{errors.supervisorEmail.message}</p>}
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setCurrentStep(2)} className="flex-1">
                    Back
                  </Button>
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? "Saving..." : "Complete Setup"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

