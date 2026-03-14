import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const names = [
  "Maria", "John", "Anna", "David", "Sarah", "Emmanuel", "Grace", "Peter",
  "Ruth", "Samuel", "Esther", "Daniel", "Miriam", "Joseph", "Rebecca",
  "Paul", "Martha", "Luke", "Naomi", "Timothy", "Lydia", "Caleb",
  "Hannah", "Joshua", "Deborah", "Andrew", "Priscilla", "Stephen",
  "Abigail", "Matthew", "Rachel", "James", "Leah", "Philip", "Eve",
  "Ngọc", "Minh", "Hương", "Thanh", "Linh", "Tuấn", "Mai", "Hòa",
  "Ji-yeon", "Yuki", "Haruto", "Sora", "Carlos", "Isabella", "Fatima",
];

const countries = [
  "🇻🇳 Việt Nam", "🇺🇸 USA", "🇬🇧 UK", "🇰🇷 Korea", "🇯🇵 Japan",
  "🇧🇷 Brazil", "🇳🇬 Nigeria", "🇵🇭 Philippines", "🇮🇳 India", "🇩🇪 Germany",
  "🇫🇷 France", "🇲🇽 Mexico", "🇨🇦 Canada", "🇦🇺 Australia", "🇿🇦 South Africa",
  "🇮🇩 Indonesia", "🇹🇭 Thailand", "🇨🇳 China", "🇪🇸 Spain", "🇮🇹 Italy",
];

const topics = ["peace", "prosperity", "poverty", "healing", "family", "nation"];

const prayers: Record<string, string[]> = {
  peace: [
    "Lord, bring peace to every corner of the world. Let wars cease and hearts be reconciled.",
    "Father, calm the storms of conflict and fill nations with Your peace that surpasses understanding.",
    "We pray for peace in our communities, families, and hearts. Let Your shalom reign.",
    "God of peace, heal the divisions among peoples and nations. Unite us in love.",
    "Prince of Peace, silence the weapons of war and plant seeds of reconciliation.",
    "Heavenly Father, grant wisdom to world leaders to pursue peace over conflict.",
    "Lord, where there is hatred, let us sow love; where there is war, let us bring peace.",
    "We cry out for peace in troubled regions. Comfort those living in fear and danger.",
  ],
  prosperity: [
    "Lord, bless the work of our hands and provide abundance for all who labor faithfully.",
    "Father, open doors of opportunity and pour out blessings that overflow.",
    "We pray for economic restoration and prosperity for communities in need.",
    "God of provision, multiply our resources so we can be generous to others.",
    "Lord, grant wisdom in stewardship and bless our endeavors for Your glory.",
    "Father, prosper the nations and let every family have enough to thrive.",
    "We ask for breakthroughs in finances, careers, and businesses for Your people.",
    "God, let prosperity flow to the hands of the generous and the faithful.",
  ],
  poverty: [
    "Lord, hear the cry of the poor and provide for their daily needs.",
    "Father, break the chains of poverty and raise up those who are oppressed.",
    "We pray for clean water, food, and shelter for every child in need.",
    "God of justice, empower communities to overcome systemic poverty.",
    "Lord, move the hearts of the wealthy to share generously with those in need.",
    "Father, provide education and opportunity for those trapped in cycles of poverty.",
    "We lift up the hungry, the homeless, and the forgotten. Show them Your love.",
    "God, use Your church to be hands and feet to serve the least of these.",
  ],
  healing: [
    "Great Physician, touch the sick and restore them to full health in body, mind, and spirit.",
    "Lord, we lift up those battling illness. Pour out Your healing power upon them.",
    "Father, comfort those in hospitals and bring breakthrough in their treatment.",
    "God, heal broken hearts and bind up wounds that no medicine can reach.",
    "We pray for miraculous healing for those whom doctors have given no hope.",
    "Lord, strengthen caregivers and medical workers as they serve the suffering.",
    "Father, bring healing to families affected by mental health challenges.",
    "God of restoration, renew strength to the weary and hope to the discouraged.",
  ],
  family: [
    "Lord, strengthen the bonds of love within families and protect them from division.",
    "Father, bless marriages and help couples grow in unity and faithfulness.",
    "We pray for children to grow up in safe, loving homes filled with Your presence.",
    "God, restore broken relationships between parents and children.",
    "Lord, protect families from the attacks of the enemy and surround them with Your grace.",
    "Father, guide parents in wisdom as they raise the next generation.",
    "We lift up single parents bearing heavy burdens. Give them strength and support.",
    "God, let every home be a sanctuary of peace, love, and worship.",
  ],
  nation: [
    "Lord, bless our nation with righteous leadership and godly wisdom.",
    "Father, bring revival to our land and turn hearts back to You.",
    "We pray for justice, truth, and integrity to prevail in governance.",
    "God, protect our nation from natural disasters, violence, and corruption.",
    "Lord, unite citizens across all divides and fill us with compassion for one another.",
    "Father, prosper our nation's economy and provide jobs for those who seek work.",
    "We pray for freedom and human rights to be upheld in every nation.",
    "God, raise up a generation of leaders who fear You and serve with humility.",
  ],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const topic = pick(topics);
    const { error } = await supabase.from("prayers").insert({
      name: pick(names),
      country: pick(countries),
      topic,
      content: pick(prayers[topic]),
      is_approved: true,
      is_anonymous: false,
      amen_count: Math.floor(Math.random() * 20),
    });

    if (error) throw error;

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("seed-prayers error:", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
