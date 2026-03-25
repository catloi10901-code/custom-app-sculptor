-- Add status column to testimonials (pending | approved | rejected)
ALTER TABLE public.testimonials
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';

-- Set existing rows to approved so they remain publicly visible
UPDATE public.testimonials
SET status = 'approved'
WHERE status IS NULL;

-- Drop public_info column (no longer needed, all approved = public)
ALTER TABLE public.testimonials
DROP COLUMN IF EXISTS public_info;

-- Public: only approved testimonials visible to everyone
DROP POLICY IF EXISTS "Testimonials viewable by everyone" ON public.testimonials;

CREATE POLICY "Testimonials viewable by everyone"
ON public.testimonials
FOR SELECT
TO public
USING (status = 'approved');

-- Authenticated users: can view their own testimonials (any status)
DROP POLICY IF EXISTS "Users can view own testimonials" ON public.testimonials;

CREATE POLICY "Users can view own testimonials"
ON public.testimonials
FOR SELECT
TO authenticated
USING (created_by = auth.uid());

-- Admins can manage all testimonials
DROP POLICY IF EXISTS "Admins can manage testimonials" ON public.testimonials;

CREATE POLICY "Admins can manage testimonials"
ON public.testimonials
FOR ALL
TO public
USING (has_role(auth.uid(), 'admin'::app_role));
