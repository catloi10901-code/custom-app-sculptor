INSERT INTO public.site_content (content_key, content_value, content_type, category, label, sort_order)
VALUES
  ('hero_bg_about',        '', 'image', 'hero', 'Ảnh nền trang About',        11),
  ('hero_bg_give',         '', 'image', 'hero', 'Ảnh nền trang Give',         12),
  ('hero_bg_news',         '', 'image', 'hero', 'Ảnh nền trang News',         13),
  ('hero_bg_library',      '', 'image', 'hero', 'Ảnh nền trang Library',      14),
  ('hero_bg_testimonials', '', 'image', 'hero', 'Ảnh nền trang Testimonials', 15),
  ('hero_bg_impact',       '', 'image', 'hero', 'Ảnh nền trang Impact',       16),
  ('hero_bg_word',         '', 'image', 'hero', 'Ảnh nền trang Word',         17)
ON CONFLICT (content_key) DO NOTHING;
