import type { ModuleFeature } from "@/types";

interface ModuleConfig {
  id: string;
  title: string;
  subtitle: string;
  targetAudience: string;
  cta: string;
  features: ModuleFeature[];
}

export const membershipModules: ModuleConfig[] = [
  {
    id: "student",
    title: "Student Membership",
    subtitle: "Foundations for undergraduates and placement students",
    targetAudience: "Undergraduate or postgraduate students",
    cta: "Build your student plan",
    features: [
      {
        id: "enrollment",
        title: "Free Membership Enrollment",
        description: "Guided RICS student registration with document assistant.",
        actions: ["Eligibility check", "Document upload", "Submission tracking"],
        metrics: [
          { label: "Processing", value: "24-48h" },
          { label: "Status", value: "98% success" }
        ]
      },
      {
        id: "academic-tracker",
        title: "Academic Progress Tracker",
        description: "Map modules to RICS competencies and plan placement year APC prep.",
        actions: ["Syllabus importer", "Competency gap heatmap", "Placement planner"],
        metrics: [
          { label: "Modules mapped", value: "12" },
          { label: "APC ready", value: "Q3 2025" }
        ]
      }
    ]
  },
  {
    id: "academic-assessment",
    title: "Academic Assessment",
    subtitle: "Degree accreditation and conversion guidance",
    targetAudience: "Graduates with non-accredited degrees",
    cta: "Submit degree assessment",
    features: [
      {
        id: "degree-checker",
        title: "Degree Accreditation Checker",
        description: "Verify accreditation status and receive conversion course options.",
        actions: ["University lookup", "Module audit", "Conversion planner"],
        metrics: [
          { label: "Turnaround", value: "4 weeks" },
          { label: "Conversion load", value: "2 modules" }
        ]
      },
      {
        id: "document-hub",
        title: "Document Submission Hub",
        description: "Structured uploads with version control and Supabase storage hooks.",
        actions: ["Template autofill", "Reviewer tagging", "RICS format validation"],
        metrics: [
          { label: "Compliance", value: "100%" },
          { label: "Storage", value: "512MB" }
        ]
      }
    ]
  },
  {
    id: "associate",
    title: "AssocRICS",
    subtitle: "Launch pad into professional recognition",
    targetAudience: "Technicians or graduates with 1-4 years experience",
    cta: "Start AssocRICS toolkit",
    features: [
      {
        id: "experience-requirement",
        title: "Experience Requirement Tracker",
        description: "Auto-calculates requirement based on qualification tier.",
        actions: ["Route detection", "Evidence tagging", "Supervisor sign-off"],
        metrics: [
          { label: "Needed", value: "24 months" },
          { label: "Logged", value: "18 months" }
        ]
      },
      {
        id: "sector-selector",
        title: "13 Sector Pathway Selector",
        description: "AI suggests best-fit sector with competency auto-population.",
        actions: ["Interest matching", "Labour insights", "Switch advisor"],
        metrics: [
          { label: "Match", value: "91%" },
          { label: "Open roles", value: "134" }
        ]
      }
    ]
  },
  {
    id: "member",
    title: "MRICS",
    subtitle: "Full chartered journey covering all routes",
    targetAudience: "Graduates and experienced professionals",
    cta: "Open MRICS hub",
    features: [
      {
        id: "apc-structured",
        title: "APC Structured Training",
        description: "12/24 month programme, diary, competencies, supervisors, and interview prep.",
        actions: [
          "Day log automation",
          "Competency matrix",
          "Interview simulator"
        ],
        metrics: [
          { label: "Diary", value: "412 days" },
          { label: "Competencies", value: "24/32" }
        ]
      },
      {
        id: "senior-routes",
        title: "All Alternate Routes",
        description: "Preliminary review, direct entry, SPA, Specialist, Academic assessment flows.",
        actions: ["Evidence portal", "Timeline gating", "Reviewer feedback"],
        metrics: [
          { label: "Routes", value: "6" },
          { label: "Docs", value: "14 templates" }
        ]
      }
    ]
  },
  {
    id: "fellow",
    title: "Fellowship (FRICS)",
    subtitle: "Executive-level recognition and peer review",
    targetAudience: "MRICS with 5+ years",
    cta: "Craft Fellowship case",
    features: [
      {
        id: "characteristics",
        title: "Characteristic Selector",
        description: "Guides candidates to pick 4 of 12 fellowship characteristics.",
        actions: ["Evidence matcher", "Story builder", "Peer reviewer assignments"],
        metrics: [
          { label: "Selected", value: "Champion, Expert" },
          { label: "Statement", value: "2 / 4" }
        ]
      },
      {
        id: "peer-review",
        title: "Peer Review Preparation",
        description: "Panel scheduling, coaching, feedback capture.",
        actions: ["Reviewer pairing", "Briefing notes", "Outcome tracking"],
        metrics: [
          { label: "Panel", value: "Confirmed" },
          { label: "Confidence", value: "87%" }
        ]
      }
    ]
  }
];
