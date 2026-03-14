import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const topics = [
  { key: "humanitarian", prompt: "Find and write about a recent real-world humanitarian aid story, such as disaster relief, refugee support, or poverty alleviation. Include specific details like location, organization involved, and impact." },
  { key: "prayer_movement", prompt: "Find and write about a recent global prayer movement, church unity event, or interfaith gathering that brought people together for peace. Include specific details." },
  { key: "clean_water", prompt: "Find and write about a recent clean water project in a developing country. Include the organization, location, number of people helped, and impact on the community." },
  { key: "education", prompt: "Find and write about a recent education initiative helping underprivileged children or communities. Include specific location, organization, and measurable outcomes." },
  { key: "health", prompt: "Find and write about a recent health or medical mission providing free healthcare to underserved communities. Include organization, location, and number of people treated." },
  { key: "peace", prompt: "Find and write about a recent peacebuilding or reconciliation effort in a conflict zone. Include specific details about the initiative and its impact." },
];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { count = 3, language = "vi" } = await req.json().catch(() => ({}));
    
    const selectedTopics = topics.sort(() => Math.random() - 0.5).slice(0, count);
    const articles = [];

    for (const topic of selectedTopics) {
      const langInstruction = language === "vi"
        ? "Viết hoàn toàn bằng tiếng Việt. Tiêu đề và nội dung đều bằng tiếng Việt."
        : "Write entirely in English.";

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content: `You are a journalist writing for UNPray, a global prayer and humanitarian platform. Write factual, hopeful articles about real-world events. ${langInstruction}
              
You MUST respond with valid JSON only, no markdown, no extra text. Use this exact format:
{
  "title": "Article title",
  "excerpt": "A 1-2 sentence summary",
  "content": "Full article content, 3-5 paragraphs with rich detail",
  "source_url": "https://relevant-source-url.com"
}`,
            },
            {
              role: "user",
              content: topic.prompt,
            },
          ],
          tools: [{
            type: "function",
            function: {
              name: "create_article",
              description: "Create an impact article",
              parameters: {
                type: "object",
                properties: {
                  title: { type: "string", description: "Article title" },
                  excerpt: { type: "string", description: "Short summary 1-2 sentences" },
                  content: { type: "string", description: "Full article, 3-5 paragraphs" },
                  source_url: { type: "string", description: "Source URL if available" },
                },
                required: ["title", "excerpt", "content"],
                additionalProperties: false,
              },
            },
          }],
          tool_choice: { type: "function", function: { name: "create_article" } },
        }),
      });

      if (!response.ok) {
        const status = response.status;
        if (status === 429) {
          return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), {
            status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (status === 402) {
          return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
            status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        console.error("AI error:", status);
        continue;
      }

      const data = await response.json();
      
      let article;
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall?.function?.arguments) {
        article = JSON.parse(toolCall.function.arguments);
      } else {
        const raw = data.choices?.[0]?.message?.content || "";
        try {
          article = JSON.parse(raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim());
        } catch {
          console.error("Failed to parse article:", raw.substring(0, 200));
          continue;
        }
      }

      const { error: insertError } = await supabase.from("impact_articles").insert({
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        source_topic: topic.key,
        source_url: article.source_url || null,
        language,
      });

      if (insertError) {
        console.error("Insert error:", insertError);
        continue;
      }

      articles.push(article);
    }

    return new Response(JSON.stringify({ success: true, count: articles.length, articles }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("fetch-impact-articles error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
