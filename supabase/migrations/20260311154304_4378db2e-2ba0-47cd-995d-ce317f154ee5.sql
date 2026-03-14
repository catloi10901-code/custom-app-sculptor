-- Allow anyone to increment view_count on published blog posts
CREATE POLICY "Anyone can increment view count"
ON public.blog_posts
FOR UPDATE
TO authenticated, anon
USING (status = 'published')
WITH CHECK (status = 'published');

-- Create atomic increment function for view_count
CREATE OR REPLACE FUNCTION public.increment_view_count(post_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.blog_posts SET view_count = view_count + 1 WHERE id = post_id AND status = 'published';
$$;