CREATE TABLE public.impact_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  source_topic TEXT NOT NULL DEFAULT 'humanitarian',
  cover_image TEXT,
  source_url TEXT,
  language TEXT NOT NULL DEFAULT 'vi',
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.impact_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Impact articles viewable by everyone" ON public.impact_articles
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage impact articles" ON public.impact_articles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_impact_articles_updated_at
  BEFORE UPDATE ON public.impact_articles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();