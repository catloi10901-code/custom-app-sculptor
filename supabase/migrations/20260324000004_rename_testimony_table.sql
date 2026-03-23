-- Drop old testimonials table (was admin-managed short quotes, replaced by submissions)
DROP TABLE IF EXISTS public.testimonials CASCADE;

-- Rename testimony_submissions → testimonials
ALTER TABLE public.testimony_submissions RENAME TO testimonials;

-- Grant SELECT to anon (public page) and authenticated
GRANT SELECT ON public.testimonials TO anon, authenticated;

-- Grant UPDATE to authenticated (admin approve/reject)
GRANT UPDATE ON public.testimonials TO authenticated;

-- Grant DELETE to authenticated (admin delete)
GRANT DELETE ON public.testimonials TO authenticated;
