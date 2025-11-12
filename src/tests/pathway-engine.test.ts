import { describe, expect, it } from "vitest";
import { generateRecommendations } from "@/lib/pathway-engine";
import type { AdvisorInput } from "@/types";

const baseInput: AdvisorInput = {
  membershipLevel: "associate",
  degreeType: "rics-accredited",
  experienceYears: 6,
  leadershipLevel: "mid",
  specialization: "Building Surveying",
  goal: "assoc-to-mrics",
  hasCounsellor: true
};

describe("generateRecommendations", () => {
  it("returns at most three recommendations", () => {
    const result = generateRecommendations(baseInput);
    expect(result).toHaveLength(3);
  });

  it("boosts routes when aligned to goal", () => {
    const result = generateRecommendations(baseInput);
    const target = result.find((item) => item.route === "assoc-to-mrics");
    expect(target?.confidence).toBeGreaterThanOrEqual(70);
  });

  it("adapts to fellowship focus", () => {
    const result = generateRecommendations({ ...baseInput, goal: "fellowship", experienceYears: 15, membershipLevel: "fellow" });
    expect(result[0].route).toBe("fellowship");
  });
});
