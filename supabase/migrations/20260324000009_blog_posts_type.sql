-- Add post_type column to blog_posts to separate word vs news content
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS post_type text NOT NULL DEFAULT 'word';

-- Existing posts default to 'word'
UPDATE public.blog_posts SET post_type = 'word' WHERE post_type = 'word';
