
CREATE TABLE public.submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  organization text,
  location text,
  deadline text,
  description text NOT NULL,
  link text NOT NULL,
  category text NOT NULL DEFAULT 'scholarship',
  status text NOT NULL DEFAULT 'pending',
  submitter_name text,
  submitter_email text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can submit
CREATE POLICY "Anyone can submit opportunities"
ON public.submissions
FOR INSERT
TO public
WITH CHECK (true);

-- Admins can view all submissions
CREATE POLICY "Admins can view submissions"
ON public.submissions
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update submissions (approve/reject)
CREATE POLICY "Admins can update submissions"
ON public.submissions
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete submissions
CREATE POLICY "Admins can delete submissions"
ON public.submissions
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
