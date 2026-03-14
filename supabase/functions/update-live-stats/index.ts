import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, serviceKey)

    let body: any = {}
    try { body = await req.json() } catch { /* no body = cron increment */ }

    const action = body?.action || 'increment'

    // Read current values + config
    const { data: current, error: readError } = await supabase
      .from('live_stats')
      .select('*')
      .eq('id', 1)
      .single()

    if (readError || !current) {
      throw new Error(`Failed to read live_stats: ${readError?.message}`)
    }

    // ACTION: update_config — save growth rate settings
    if (action === 'update_config') {
      const cfg = body.config
      const { error } = await supabase
        .from('live_stats')
        .update({
          prayer_min: cfg.prayer_min,
          prayer_max: cfg.prayer_max,
          member_chance: cfg.member_chance,
          member_min: cfg.member_min,
          member_max: cfg.member_max,
          donation_amounts: cfg.donation_amounts,
          updated_at: new Date().toISOString(),
        })
        .eq('id', 1)

      if (error) throw new Error(`Failed to update config: ${error.message}`)
      return new Response(JSON.stringify({ success: true, action: 'update_config' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // ACTION: set_values — manually set stat values
    if (action === 'set_values') {
      const vals = body.values
      const { error } = await supabase
        .from('live_stats')
        .update({
          prayers_count: vals.prayers_count,
          members_count: vals.members_count,
          donated_total: vals.donated_total,
          updated_at: new Date().toISOString(),
        })
        .eq('id', 1)

      if (error) throw new Error(`Failed to set values: ${error.message}`)
      return new Response(JSON.stringify({ success: true, action: 'set_values' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // ACTION: increment — use config from DB
    const prayerMin = current.prayer_min ?? 1
    const prayerMax = current.prayer_max ?? 3
    const memberChance = Number(current.member_chance ?? 0.6)
    const memberMin = current.member_min ?? 1
    const memberMax = current.member_max ?? 2
    const donationAmountsStr = current.donation_amounts ?? '1,5,10,25,50,100'
    const donationAmounts = donationAmountsStr.split(',').map((s: string) => Number(s.trim())).filter((n: number) => !isNaN(n) && n > 0)

    const randRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

    const prayersDelta = randRange(prayerMin, prayerMax)
    const membersDelta = Math.random() < memberChance ? randRange(memberMin, memberMax) : 0
    const donatedDelta = donationAmounts.length > 0
      ? donationAmounts[Math.floor(Math.random() * donationAmounts.length)]
      : 0

    const { error: updateError } = await supabase
      .from('live_stats')
      .update({
        prayers_count: Number(current.prayers_count) + prayersDelta,
        members_count: Number(current.members_count) + membersDelta,
        donated_total: Number(current.donated_total) + donatedDelta,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1)

    if (updateError) {
      throw new Error(`Failed to update live_stats: ${updateError.message}`)
    }

    return new Response(JSON.stringify({ success: true, prayersDelta, membersDelta, donatedDelta }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
