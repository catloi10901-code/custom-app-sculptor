
-- 1. site_content: key-value store for editable site text/links/images
CREATE TABLE public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_key text UNIQUE NOT NULL,
  content_value text NOT NULL DEFAULT '',
  content_type text NOT NULL DEFAULT 'text', -- text, url, image
  category text NOT NULL DEFAULT 'general', -- hero, footer, social, stats
  label text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site content viewable by everyone" ON public.site_content FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage site content" ON public.site_content FOR ALL TO public USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. live_sessions: manage LIVE cards
CREATE TABLE public.live_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  host text NOT NULL DEFAULT '',
  scheduled_time timestamptz,
  youtube_url text,
  is_live boolean NOT NULL DEFAULT false,
  viewers integer NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Live sessions viewable by everyone" ON public.live_sessions FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage live sessions" ON public.live_sessions FOR ALL TO public USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. testimonials
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote text NOT NULL,
  name text NOT NULL,
  organization text NOT NULL DEFAULT '',
  avatar_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Testimonials viewable by everyone" ON public.testimonials FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Admins can manage testimonials" ON public.testimonials FOR ALL TO public USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed some default site_content
INSERT INTO public.site_content (content_key, content_value, content_type, category, label, sort_order) VALUES
('hero_badge', '🌍 United Nations Prayer Initiative', 'text', 'hero', 'Hero Badge', 1),
('hero_title', 'Cầu Nguyện Cho Thế Giới', 'text', 'hero', 'Hero Title', 2),
('hero_subtitle', 'Nền tảng cầu nguyện toàn cầu kết nối hàng triệu người', 'text', 'hero', 'Hero Subtitle', 3),
('social_facebook', '#', 'url', 'social', 'Facebook URL', 1),
('social_instagram', '#', 'url', 'social', 'Instagram URL', 2),
('social_youtube', '#', 'url', 'social', 'YouTube URL', 3),
('social_twitter', '#', 'url', 'social', 'Twitter/X URL', 4),
('footer_email', 'contact@unpray.org', 'text', 'footer', 'Email liên hệ', 1),
('stat_prayers', '2.4M+', 'text', 'stats', 'Số lời cầu nguyện', 1),
('stat_countries', '195', 'text', 'stats', 'Số quốc gia', 2),
('stat_donated', '$847K', 'text', 'stats', 'Tổng quyên góp', 3),
('stat_members', '500K+', 'text', 'stats', 'Số thành viên', 4);
