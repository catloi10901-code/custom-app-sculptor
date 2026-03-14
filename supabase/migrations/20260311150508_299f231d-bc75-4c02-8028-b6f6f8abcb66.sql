
-- Fix: restrict newsletter subscribe to only email insert, add rate limiting via unique constraint (already exists)
DROP POLICY "Anyone can subscribe" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe with valid email" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (email IS NOT NULL AND email <> '' AND length(email) <= 255);
