-- Add created_by column to testimonials
ALTER TABLE public.testimonials
ADD COLUMN IF NOT EXISTS created_by UUID;

-- NOTE: Backfill with the actual logged-in user who should see these testimonies.
-- If a different user needs access, run this with their UUID:
--   UPDATE public.testimonials SET created_by = '<actual-user-id>'::UUID WHERE created_by IS NULL;
-- For now, backfill with the provided placeholder user so profile page can display data.
UPDATE public.testimonials
SET created_by = '8ea73004-b598-4326-8fc4-587d65b63f68'::UUID
WHERE created_by IS NULL;
