
-- Create job_positions table
CREATE TABLE public.job_positions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.job_positions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active positions viewable by everyone" ON public.job_positions
  FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Admins can manage positions" ON public.job_positions
  FOR ALL TO public USING (has_role(auth.uid(), 'admin'::app_role));

-- Create job_applications table
CREATE TABLE public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  position text NOT NULL,
  message text NOT NULL DEFAULT '',
  resume_url text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit application" ON public.job_applications
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Admins can manage applications" ON public.job_applications
  FOR ALL TO public USING (has_role(auth.uid(), 'admin'::app_role));
