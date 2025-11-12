"use client";

import { usePathwayAdvisor } from "@/hooks/usePathwayAdvisor";
import { AdvisorForm } from "@/components/advisor/advisor-form";
import { RecommendationPanel } from "@/components/advisor/recommendation-panel";
import { AIShowcase } from "@/components/shared/ai-showcase";

export default function AdvisorPage() {
  const { input, setInput, recommendations } = usePathwayAdvisor();

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[420px,1fr]">
        <AdvisorForm value={input} onChange={setInput} />
        <RecommendationPanel recommendations={recommendations} />
      </div>
      <AIShowcase />
    </div>
  );
}
