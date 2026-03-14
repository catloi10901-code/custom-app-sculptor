CREATE POLICY "Anyone can view donation amounts"
  ON public.donations FOR SELECT
  TO anon
  USING (true);