export type MembershipLevel =
  | "student"
  | "associate"
  | "member"
  | "fellow"
  | "senior"
  | "academic";

export type AssessmentRoute =
  | "student-to-assoc"
  | "assoc-to-mrics"
  | "direct-mrics"
  | "preliminary-review"
  | "direct-entry"
  | "senior-professional"
  | "specialist"
  | "academic-assessment"
  | "fellowship";

export interface AdvisorInput {
  membershipLevel: MembershipLevel;
  degreeType: "rics-accredited" | "related" | "non-related";
  experienceYears: number;
  leadershipLevel: "early" | "mid" | "senior";
  specialization: string;
  goal: AssessmentRoute;
  hasCounsellor: boolean;
}

export interface TimelineProjection {
  minMonths: number;
  maxMonths: number;
  milestones: Array<{ label: string; month: number; description: string }>;
}

export interface CostBreakdownItem {
  label: string;
  amount: number;
  description?: string;
}

export interface PathwayRecommendation {
  route: AssessmentRoute;
  title: string;
  rationale: string;
  confidence: number;
  successProbability: number;
  riskFactors: string[];
  timeline: TimelineProjection;
  costs: CostBreakdownItem[];
  prerequisites: string[];
  suggestedCompetencies: string[];
}

export interface Competency {
  id: string;
  name: string;
  type: "mandatory" | "core" | "optional";
  requiredLevel: 1 | 2 | 3;
  description: string;
  pathway?: string;
}

export interface ExperienceEntry {
  id: string;
  title: string;
  pathway: string;
  competencies: string[];
  levelAchieved: 1 | 2 | 3;
  hours: number;
  date: string;
}

export interface CPDRequirement {
  id: string;
  label: string;
  minimumHours: number;
  type: "formal" | "informal" | "structured";
  appliesTo: MembershipLevel[];
}

export interface SubscriptionTier {
  id: "free" | "professional" | "fellowship" | "enterprise";
  price: string;
  badge: string;
  targetUsers: string;
  features: string[];
}

export interface ModuleFeature {
  id: string;
  title: string;
  description: string;
  actions: string[];
  metrics: { label: string; value: string }[];
}
