-- Increment pray_together_count RPC
CREATE OR REPLACE FUNCTION increment_pray_together_count(post_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE blog_posts
  SET pray_together_count = pray_together_count + 1
  WHERE id = post_id;
END;
$$;
