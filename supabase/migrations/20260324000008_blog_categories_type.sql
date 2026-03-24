-- Add type column to blog_categories to distinguish word vs news categories
ALTER TABLE public.blog_categories
  ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'word';

-- Existing categories are word categories
UPDATE public.blog_categories SET type = 'word' WHERE type = 'word';
