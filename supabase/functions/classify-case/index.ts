import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const LEGAL_CATEGORIES = [
  "criminal",
  "civil",
  "family",
  "corporate",
  "property",
  "cyber",
  "tax",
  "labor",
  "constitutional",
  "immigration",
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { description } = await req.json();

    if (!description || description.trim().length < 10) {
      return new Response(
        JSON.stringify({
          error: "Please provide at least 10 characters.",
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
      return new Response(
        JSON.stringify({
          error: "GROQ_API_KEY is not configured.",
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

    const systemPrompt = `
You are a legal case classifier for an advocate finder application.

STRICT RULES:
1. ONLY classify legal issues.
2. NEVER provide legal advice.
3. NEVER predict outcomes.
4. NEVER suggest legal strategies.
5. Return ONLY valid JSON.

VALID CATEGORIES:
${LEGAL_CATEGORIES.join(", ")}

OUTPUT FORMAT:

{
  "category": "one of valid categories",
  "specialization": "specific legal specialization",
  "confidence": "high|medium|low",
  "keywords": ["keyword1", "keyword2"],
  "disclaimer": "This is an automated classification only. Please consult a qualified advocate for legal advice."
}

If the issue is not legal, return:

{
  "category": "unknown",
  "specialization": "general",
  "confidence": "low",
  "keywords": [],
  "disclaimer": "This does not appear to be a legal matter."
}
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
              content: `Classify this legal issue:

"${description}"

Return ONLY valid JSON.`,
            },
          ],
          temperature: 0.2,
          max_tokens: 500,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Groq Error:", errorText);

      return new Response(
        JSON.stringify({
          error: errorText,
        }),
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

    if (!content) {
      throw new Error("Empty AI response");
    }

    let classification;

    try {
      const jsonMatch =
        content.match(/```(?:json)?\s*([\s\S]*?)```/) ||
        [null, content];

      classification = JSON.parse(jsonMatch[1].trim());
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);

      classification = {
        category: "civil",
        specialization: "civil",
        confidence: "low",
        keywords: [],
        disclaimer:
          "Unable to confidently classify this case. Please consult an advocate.",
      };
    }

    return new Response(
      JSON.stringify(classification),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("classify-case error:", error);

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Classification failed",
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