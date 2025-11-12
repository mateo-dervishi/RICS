import { NextResponse } from "next/server";
import { generateRecommendations } from "@/lib/pathway-engine";
import type { AdvisorInput } from "@/types";

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<AdvisorInput>;
  const recommendations = generateRecommendations({
    membershipLevel: payload.membershipLevel ?? "student",
    degreeType: payload.degreeType ?? "rics-accredited",
    experienceYears: payload.experienceYears ?? 0,
    leadershipLevel: payload.leadershipLevel ?? "early",
    specialization: payload.specialization ?? "Building Surveying",
    goal: payload.goal ?? "student-to-assoc",
    hasCounsellor: payload.hasCounsellor ?? false
  });
  return NextResponse.json({ recommendations });
}
