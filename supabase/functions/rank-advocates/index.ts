import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface Advocate {
  id: string;
  name: string;
  specializations: string[];
  experience: number;
  rating: number;
  city: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { advocates, query, category, keywords } = await req.json();

    if (!advocates || !Array.isArray(advocates)) {
      return new Response(
        JSON.stringify({ error: "Invalid advocates data" }),
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
You are an advocate ranking engine.

ONLY rank advocates.

Ranking priority:
1. Exact specialization match
2. Related specialization match
3. Experience
4. Rating

Return ONLY a JSON array of advocate IDs.

Example:
["id1","id2","id3"]
`;

    const advocateList = advocates.map((a: Advocate) => ({
      id: a.id,
      name: a.name,
      specializations: a.specializations,
      experience: a.experience,
      rating: a.rating,
    }));

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
              content: `
Query: ${query || "general"}

Category: ${category || "any"}

Keywords:
${keywords?.join(", ") || "none"}

Advocates:
${JSON.stringify(advocateList, null, 2)}

Return ONLY JSON array.
`,
            },
          ],
          temperature: 0.1,
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

    let rankedIds: string[];

    try {
      const jsonMatch =
        content.match(/```(?:json)?\s*([\s\S]*?)```/) ||
        [null, content];

      rankedIds = JSON.parse(jsonMatch[1].trim());
    } catch {
      rankedIds = advocates.map((a: Advocate) => a.id);
    }

    return new Response(
      JSON.stringify({ rankedIds }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("rank-advocates error:", error);

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Ranking failed",
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