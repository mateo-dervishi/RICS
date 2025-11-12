import type { SubscriptionTier } from "@/types";

export const subscriptionTiers: SubscriptionTier[] = [
  {
    id: "free",
    price: "£0",
    badge: "Students",
    targetUsers: "Students & early explorers",
    features: [
      "Pathway basics",
      "Competency checklist",
      "CPD logger",
      "Community access"
    ]
  },
  {
    id: "professional",
    price: "£19/mo",
    badge: "Professional",
    targetUsers: "AssocRICS & MRICS candidates",
    features: [
      "Full competency suite",
      "AI writing assistant",
      "Document templates",
      "Progress analytics"
    ]
  },
  {
    id: "fellowship",
    price: "£29/mo",
    badge: "Fellowship",
    targetUsers: "MRICS aiming for FRICS",
    features: [
      "Fellowship toolkit",
      "Peer review network",
      "Executive coaching",
      "Evidence vault"
    ]
  },
  {
    id: "enterprise",
    price: "Custom",
    badge: "Enterprise",
    targetUsers: "Firms with APC programmes",
    features: [
      "Multi-team dashboards",
      "Bulk enrollment",
      "API & SSO",
      "White-label"
    ]
  }
];
