-- Create testimony_submissions table for public witness/testimonial submissions
CREATE TABLE public.testimony_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Personal info
  full_name text NOT NULL,
  birth_date date,
  facebook text,
  phone text,
  email text,
  address text,
  -- Testimony content
  title text NOT NULL,
  before_prayer text NOT NULL,
  after_prayer text NOT NULL,
  current_status text,
  message text,
  -- Media
  media_urls text[] DEFAULT '{}',
  -- Meta
  status text NOT NULL DEFAULT 'pending', -- pending | approved | rejected
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.testimony_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can submit
CREATE POLICY "Anyone can submit testimony" ON public.testimony_submissions
  FOR INSERT TO public WITH CHECK (true);

-- Only admins can read/manage
CREATE POLICY "Admins can manage testimony submissions" ON public.testimony_submissions
  FOR ALL TO public USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for testimony media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'testimony-media',
  'testimony-media',
  true,
  52428800, -- 50MB
  ARRAY['image/jpeg','image/png','image/gif','image/webp','video/mp4','video/quicktime','video/webm']
)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to upload
CREATE POLICY "Anyone can upload testimony media" ON storage.objects
  FOR INSERT TO public WITH CHECK (bucket_id = 'testimony-media');

-- Allow anyone to view
CREATE POLICY "Anyone can view testimony media" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'testimony-media');

-- Admins can delete
CREATE POLICY "Admins can delete testimony media" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'testimony-media' AND has_role(auth.uid(), 'admin'::app_role));
