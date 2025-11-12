import type { Competency } from "@/types";

export const mandatoryCompetencies: Competency[] = [
  {
    id: "ethics",
    name: "Ethics, Rules of Conduct and Professionalism",
    type: "mandatory",
    requiredLevel: 3,
    description: "Demonstrate ethical decision-making and adherence to RICS standards."
  },
  {
    id: "client-care",
    name: "Client Care",
    type: "mandatory",
    requiredLevel: 2,
    description: "Deliver responsive and proactive client service."
  },
  {
    id: "communication",
    name: "Communication & Negotiation",
    type: "mandatory",
    requiredLevel: 2,
    description: "Prepare robust advice and negotiate commercially sound outcomes."
  },
  {
    id: "health-safety",
    name: "Health & Safety",
    type: "mandatory",
    requiredLevel: 2,
    description: "Embed safety leadership and compliance."
  },
  {
    id: "accounting",
    name: "Accounting Principles",
    type: "mandatory",
    requiredLevel: 1,
    description: "Understand financial statements and controls."
  },
  {
    id: "business-planning",
    name: "Business Planning",
    type: "mandatory",
    requiredLevel: 1,
    description: "Plan and monitor business objectives."
  },
  {
    id: "conflict-avoidance",
    name: "Conflict Avoidance",
    type: "mandatory",
    requiredLevel: 2,
    description: "Apply dispute resolution and negotiation tactics."
  },
  {
    id: "data-management",
    name: "Data Management",
    type: "mandatory",
    requiredLevel: 2,
    description: "Maintain accurate data governance and analytics."
  },
  {
    id: "dei",
    name: "Diversity, Inclusion & Inclusive Environments",
    type: "mandatory",
    requiredLevel: 1,
    description: "Champion inclusive behaviours and accessible environments."
  },
  {
    id: "sustainability",
    name: "Sustainability",
    type: "mandatory",
    requiredLevel: 2,
    description: "Embed carbon, social value, and lifecycle considerations."
  }
];

export const cpdRequirements = [
  {
    id: "student",
    label: "Student & Pre-qualification",
    minimumHours: 0,
    type: "informal" as const,
    appliesTo: ["student"]
  },
  {
    id: "assoc",
    label: "AssocRICS Annual",
    minimumHours: 20,
    type: "formal" as const,
    appliesTo: ["associate"]
  },
  {
    id: "apc",
    label: "Structured Training",
    minimumHours: 48,
    type: "structured" as const,
    appliesTo: ["associate", "member"]
  },
  {
    id: "mrics",
    label: "MRICS Annual",
    minimumHours: 20,
    type: "formal" as const,
    appliesTo: ["member", "senior", "fellow"]
  }
];
