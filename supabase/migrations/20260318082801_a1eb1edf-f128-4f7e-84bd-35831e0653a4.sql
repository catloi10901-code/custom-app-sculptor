-- Allow admins to delete and update newsletter subscribers
CREATE POLICY "Admins can manage subscribers"
ON public.newsletter_subscribers
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
