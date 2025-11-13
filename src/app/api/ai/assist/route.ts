import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // No authentication required - simplified version

    const body = await request.json();
    const { type, content, competency, level } = body;

    // Check if OpenAI API key is configured
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured. Please set OPENAI_API_KEY in your environment variables." },
        { status: 500 }
      );
    }

    // Build prompt based on type
    let systemPrompt = "";
    let userPrompt = "";

    switch (type) {
      case "summary-suggestions":
        systemPrompt = `You are an expert RICS APC assessor helping a candidate write their Summary of Experience. 
        The candidate is writing about ${competency} at Level ${level}.
        Provide constructive suggestions to improve their writing, ensuring it demonstrates:
        - Level ${level === 1 ? "knowledge and understanding" : level === 2 ? "application of knowledge" : "reasoned advice and depth"}
        - Specific examples from experience
        - Clear outcomes and impact
        - Professional language appropriate for RICS submission`;
        userPrompt = `Review this summary and provide specific suggestions:\n\n${content}`;
        break;

      case "case-study-structure":
        systemPrompt = `You are helping a RICS APC candidate structure their case study. 
        Provide guidance on how to effectively demonstrate technical competencies through their case study.`;
        userPrompt = `Help me structure my case study. Project overview: ${content}`;
        break;

      case "competency-mapping":
        systemPrompt = `You are a RICS competency expert. Analyze the provided experience description and identify which RICS competencies it demonstrates and at what level.`;
        userPrompt = `Analyze this experience and suggest relevant competencies:\n\n${content}`;
        break;

      case "interview-prep":
        systemPrompt = `You are a RICS APC assessor. Help prepare a candidate for their interview by providing feedback on their answer using the STAR technique.`;
        userPrompt = `Review this interview answer and provide feedback:\n\n${content}`;
        break;

      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error: error.error?.message || "OpenAI API error" }, { status: 500 });
    }

    const data = await response.json();
    const suggestions = data.choices[0]?.message?.content || "No suggestions available.";

    return NextResponse.json({ suggestions });
  } catch (error: any) {
    console.error("AI assist error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

