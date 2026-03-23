-- Replace birth_year with birth_date in testimony_submissions
ALTER TABLE public.testimony_submissions
  ADD COLUMN IF NOT EXISTS birth_date date,
  DROP COLUMN IF EXISTS birth_year;
