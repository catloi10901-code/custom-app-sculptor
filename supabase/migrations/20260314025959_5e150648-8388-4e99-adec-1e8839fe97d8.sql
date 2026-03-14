
CREATE TABLE public.live_stats (
  id integer PRIMARY KEY DEFAULT 1,
  prayers_count bigint NOT NULL DEFAULT 0,
  members_count bigint NOT NULL DEFAULT 0,
  donated_total numeric NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Seed initial row with current real counts
INSERT INTO public.live_stats (id, prayers_count, members_count, donated_total)
SELECT 
  1,
  (SELECT count(*) FROM prayers),
  (SELECT count(*) FROM profiles),
  COALESCE((SELECT sum(amount) FROM donations WHERE status = 'completed'), 0);

-- RLS: everyone can read
ALTER TABLE public.live_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read live_stats" ON public.live_stats FOR SELECT USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_stats;
