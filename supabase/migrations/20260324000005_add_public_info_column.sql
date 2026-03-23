ALTER TABLE public.testimonials
  ADD COLUMN IF NOT EXISTS public_info boolean NOT NULL DEFAULT false;
