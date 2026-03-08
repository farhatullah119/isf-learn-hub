
-- Create saved opportunities table
CREATE TABLE public.saved_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  opportunity_id uuid NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  saved_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, opportunity_id)
);

-- Enable RLS
ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;

-- Users can view their own saved opportunities
CREATE POLICY "Users can view own saved"
ON public.saved_opportunities FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users can save opportunities
CREATE POLICY "Users can save opportunities"
ON public.saved_opportunities FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can unsave opportunities
CREATE POLICY "Users can unsave opportunities"
ON public.saved_opportunities FOR DELETE
TO authenticated
USING (user_id = auth.uid());
