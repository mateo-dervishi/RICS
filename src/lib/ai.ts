/**
 * AI assistance utilities for RICS APC application
 */

export interface AISuggestionRequest {
  type: "summary-suggestions" | "case-study-structure" | "competency-mapping" | "interview-prep";
  content: string;
  competency?: string;
  level?: number;
}

export async function getAISuggestions(request: AISuggestionRequest): Promise<string> {
  try {
    const response = await fetch("/api/ai/assist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to get AI suggestions");
    }

    const data = await response.json();
    return data.suggestions;
  } catch (error: any) {
    throw new Error(error.message || "AI service unavailable");
  }
}

