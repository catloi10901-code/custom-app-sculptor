-- Allow anonymous users to upload testimony media to uploads bucket (subfolder testimony/)
CREATE POLICY "Anyone can upload testimony media"
ON storage.objects FOR INSERT TO public
WITH CHECK (bucket_id = 'uploads' AND (storage.foldername(name))[1] = 'testimony');

-- Fix testimony_submissions INSERT policy (drop old, recreate explicitly for anon + authenticated)
DROP POLICY IF EXISTS "Anyone can submit testimony" ON public.testimony_submissions;

CREATE POLICY "Anyone can submit testimony" ON public.testimony_submissions
  FOR INSERT WITH CHECK (true);
