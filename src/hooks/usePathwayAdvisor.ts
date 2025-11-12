"use client";

import { useEffect, useState } from "react";
import { generateRecommendations } from "@/lib/pathway-engine";
import type { AdvisorInput, PathwayRecommendation } from "@/types";

const defaultInput: AdvisorInput = {
  membershipLevel: "student",
  degreeType: "rics-accredited",
  experienceYears: 0,
  leadershipLevel: "early",
  specialization: "Building Surveying",
  goal: "student-to-assoc",
  hasCounsellor: false
};

export function usePathwayAdvisor(initial?: Partial<AdvisorInput>) {
  const [input, setInput] = useState<AdvisorInput>({ ...defaultInput, ...initial });
  const [recommendations, setRecommendations] = useState<PathwayRecommendation[]>(() =>
    generateRecommendations({ ...defaultInput, ...initial })
  );

  useEffect(() => {
    setRecommendations(generateRecommendations(input));
  }, [input]);

  return { input, setInput, recommendations };
}
