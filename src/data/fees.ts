import type { CostBreakdownItem } from "@/types";

export const baseFees: CostBreakdownItem[] = [
  { label: "Enrollment", amount: 502, description: "Typical entry fee range" },
  { label: "Assessment", amount: 650, description: "Associate/MRICS assessment" },
  { label: "Annual Subscription", amount: 215, description: "Member subscription" }
];

export const fellowshipFees: CostBreakdownItem[] = [
  { label: "Fellowship Application", amount: 331, description: "Payable on submission" },
  { label: "FRICS Subscription", amount: 399, description: "Payable annually after success" }
];
