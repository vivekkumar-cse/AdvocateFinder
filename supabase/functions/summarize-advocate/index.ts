import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const { advocate } = await req.json();

    if (!advocate) {
      return new Response(
        JSON.stringify({
          error: "Advocate data required",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");

    if (!GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not configured");
    }

    const systemPrompt = `
You are a professional advocate profile summarizer.

Rules:
- Never give legal advice
- Never guarantee outcomes
- Keep summary professional

Return JSON only:

{
  "shortBio":"...",
  "highlights":["...","...","..."],
  "expertiseAreas":"..."
}
`;

    const advocateData = `
Name: ${advocate.name}
Experience: ${advocate.experience}
Specializations: ${advocate.specializations?.join(", ")}
Education: ${advocate.education || "Not specified"}
Languages: ${advocate.languages?.join(", ") || "Not specified"}
Location: ${advocate.city}
Rating: ${advocate.rating}
About: ${advocate.about || ""}
`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: advocateData,
            },
          ],
          temperature: 0.4,
          max_tokens: 500,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      return new Response(
        JSON.stringify({ error: errorText }),
        {
          status: response.status,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const data = await response.json();

    const content =
      data?.choices?.[0]?.message?.content;

    let summary;

    try {
      const jsonMatch =
        content.match(/```(?:json)?\s*([\s\S]*?)```/) ||
        [null, content];

      summary = JSON.parse(jsonMatch[1].trim());
    } catch {
      summary = {
        shortBio: `${advocate.name} is an experienced advocate with ${advocate.experience} years of practice.`,
        highlights:
          advocate.specializations?.slice(0, 3) || [],
        expertiseAreas:
          advocate.specializations?.join(", ") ||
          "General Practice",
      };
    }

    return new Response(
      JSON.stringify(summary),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("summarize-advocate error:", error);

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Summarization failed",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});