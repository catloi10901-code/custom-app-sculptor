import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const topicPrompts: Record<string, string> = {
  peace: "hòa bình thế giới, chấm dứt chiến tranh và xung đột",
  prosperity: "sự thịnh vượng, phát triển kinh tế và phúc lợi cho mọi người",
  poverty: "xóa đói giảm nghèo, giúp đỡ những người khó khăn",
  healing: "chữa lành bệnh tật, phục hồi sức khỏe thể chất và tinh thần",
  family: "gia đình hạnh phúc, gắn kết yêu thương",
  nation: "quốc gia hưng thịnh, lãnh đạo khôn ngoan, công lý xã hội",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { topic, language = "vi" } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const topicDesc = topicPrompts[topic] || topic;
    const langInstruction = language === "vi" 
      ? "Viết bằng tiếng Việt." 
      : "Write in English.";

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
            content: `Bạn là một người viết lời cầu nguyện Cơ Đốc giáo. Viết lời cầu nguyện chân thành, ngắn gọn (3-5 câu), sâu sắc và đầy hy vọng. ${langInstruction} Chỉ trả về lời cầu nguyện, không thêm gì khác.`,
          },
          {
            role: "user",
            content: `Viết một lời cầu nguyện về chủ đề: ${topicDesc}`,
          },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Quá nhiều yêu cầu, vui lòng thử lại sau." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Đã hết credits AI." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${status}`);
    }

    const data = await response.json();
    const prayer = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ prayer }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-prayer error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
