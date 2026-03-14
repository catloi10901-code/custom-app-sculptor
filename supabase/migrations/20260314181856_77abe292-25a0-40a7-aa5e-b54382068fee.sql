
CREATE TABLE public.campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon text NOT NULL DEFAULT '🙏',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  participants integer NOT NULL DEFAULT 0,
  goal integer NOT NULL DEFAULT 10000,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Campaigns viewable by everyone" ON public.campaigns
  FOR SELECT TO public USING (true);

CREATE POLICY "Admins can manage campaigns" ON public.campaigns
  FOR ALL TO public USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
