import { baseFees, fellowshipFees } from "@/data/fees";
import { sectorPathways } from "@/data/pathways";
import type {
  AdvisorInput,
  AssessmentRoute,
  PathwayRecommendation,
  TimelineProjection
} from "@/types";

const routeWeights: Record<AssessmentRoute, { baseConfidence: number; duration: [number, number] }> = {
  "student-to-assoc": { baseConfidence: 0.72, duration: [12, 24] },
  "assoc-to-mrics": { baseConfidence: 0.68, duration: [24, 36] },
  "direct-mrics": { baseConfidence: 0.64, duration: [9, 18] },
  "preliminary-review": { baseConfidence: 0.55, duration: [6, 12] },
  "direct-entry": { baseConfidence: 0.63, duration: [6, 10] },
  "senior-professional": { baseConfidence: 0.58, duration: [4, 9] },
  "specialist": { baseConfidence: 0.6, duration: [6, 12] },
  "academic-assessment": { baseConfidence: 0.62, duration: [6, 12] },
  fellowship: { baseConfidence: 0.57, duration: [5 * 12, 24 * 12] }
};

const routeDescriptions: Record<AssessmentRoute, string> = {
  "student-to-assoc": "Foundation journey from free student membership to AssocRICS portfolio.",
  "assoc-to-mrics": "Structured training programme feeding into APC assessment.",
  "direct-mrics": "Fast-track to MRICS for accredited degrees with 5+ years experience.",
  "preliminary-review": "Route for non-accredited degrees with 5+ years, requiring RICS review before APC.",
  "direct-entry": "10+ years with RICS degree, direct to final assessment portfolio.",
  "senior-professional": "Leadership-focused assessment emphasising strategic impacts.",
  "specialist": "For recognised authorities and niche expertise requiring specialist evidence.",
  "academic-assessment": "For academics with 3+ years teaching/research demonstrating impact.",
  fellowship: "FRICS submission showcasing Champion, Expert, Influencer, and Role Model characteristics."
};

const prerequisiteMap: Record<AssessmentRoute, string[]> = {
  "student-to-assoc": ["Active student status", "Plan placement APC", "Matrics engagement"],
  "assoc-to-mrics": ["Counsellor assigned", "12-24 month diary", "Competency coverage"],
  "direct-mrics": ["5+ years", "RICS accredited degree", "Portfolio evidence"],
  "preliminary-review": ["5+ years", "Non-accredited degree", "Preliminary submission"],
  "direct-entry": ["10+ years", "RICS accredited degree", "Leadership references"],
  "senior-professional": ["Senior leadership role", "Strategic responsibility", "People management"],
  "specialist": ["Published expertise", "Industry recognition", "Niche services"],
  "academic-assessment": ["3+ years academia", "Research outputs", "Teaching impact"],
  fellowship: ["5+ years MRICS", "4 characteristics evidence", "Peer referees"]
};

const riskRegistry: Record<AssessmentRoute, string[]> = {
  "student-to-assoc": ["Limited industry exposure", "Need placement evidence"],
  "assoc-to-mrics": ["Competency gaps", "Diary accuracy"],
  "direct-mrics": ["Condensed preparation", "Limited supervisory feedback"],
  "preliminary-review": ["Document rework risk", "Longer RICS SLA"],
  "direct-entry": ["High evidence burden", "Interview readiness"],
  "senior-professional": ["Strategic evidence clarity", "Leadership verification"],
  "specialist": ["Proof of authority", "Narrow scope scrutiny"],
  "academic-assessment": ["Research impact quantification", "Teaching evidence"],
  fellowship: ["Peer scrutiny", "High-quality narratives"]
};

function buildTimeline(route: AssessmentRoute): TimelineProjection {
  const [minMonths, maxMonths] = routeWeights[route].duration;
  const anchors: TimelineProjection["milestones"] = [
    { label: "Commit", month: 0, description: "Route selection, subscription, onboarding." },
    { label: "Evidence", month: Math.round(minMonths * 0.35), description: "Gather documents & supervisor reviews." },
    { label: "Submission", month: minMonths, description: "Submit portfolio/application." },
    { label: "Assessment", month: Math.round((minMonths + maxMonths) / 2), description: "Interview, review, or panel." },
    { label: "Award", month: maxMonths, description: "Receive result and upgrade membership." }
  ];

  return { minMonths, maxMonths, milestones: anchors };
}

function addCosts(route: AssessmentRoute) {
  if (route === "fellowship") {
    return [...baseFees, ...fellowshipFees];
  }
  if (route === "student-to-assoc") {
    return [{ label: "Student membership", amount: 0, description: "Free membership" }, ...baseFees];
  }
  return baseFees;
}

function inferSuggestedCompetencies(specialization: string) {
  const match = sectorPathways.find((pathway) => pathway.name.toLowerCase() === specialization.toLowerCase());
  if (!match) {
    return ["Ethics", "Client care", "Health & safety"];
  }
  return match.competencies;
}

export function generateRecommendations(input: AdvisorInput): PathwayRecommendation[] {
  const ranks: Array<{ route: AssessmentRoute; score: number }> = Object.entries(routeWeights).map(
    ([route, config]) => {
      const experienceScore = Math.min(input.experienceYears / 10, 1);
      const leadershipBoost = input.leadershipLevel === "senior" ? 0.1 : input.leadershipLevel === "mid" ? 0.05 : 0;
      const accreditationBoost = input.degreeType === "rics-accredited" ? 0.08 : input.degreeType === "related" ? 0.04 : 0;
      const targetBoost = input.goal === route ? 0.12 : 0;
      const counsellorBoost = input.hasCounsellor ? 0.03 : 0;
      const score = config.baseConfidence + experienceScore * 0.2 + leadershipBoost + accreditationBoost + targetBoost + counsellorBoost;
      return { route: route as AssessmentRoute, score };
    }
  );

  const sorted = ranks.sort((a, b) => b.score - a.score).slice(0, 3);

  return sorted.map(({ route, score }) => {
    const timeline = buildTimeline(route);
    const successProbability = Math.min(0.95, Math.max(0.45, score));
    const confidence = Math.round(successProbability * 100);

    return {
      route,
      title: routeDescriptions[route],
      rationale: `Fit based on ${input.experienceYears} years experience, ${input.degreeType} degree, and ${input.leadershipLevel} leadership exposure.`,
      confidence,
      successProbability: successProbability * 100,
      riskFactors: riskRegistry[route],
      timeline,
      costs: addCosts(route),
      prerequisites: prerequisiteMap[route],
      suggestedCompetencies: inferSuggestedCompetencies(input.specialization)
    } satisfies PathwayRecommendation;
  });
}
