-- Add pray_together_count column to blog_posts
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS pray_together_count INTEGER NOT NULL DEFAULT 0;
