
-- Ad banners table for admin-managed ads
CREATE TABLE public.ad_banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  link_url TEXT NOT NULL,
  placement TEXT NOT NULL DEFAULT 'sidebar',
  is_active BOOLEAN NOT NULL DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  click_count INTEGER NOT NULL DEFAULT 0,
  impression_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ad_banners ENABLE ROW LEVEL SECURITY;

-- Anyone can view active ads
CREATE POLICY "Anyone can view active ads"
ON public.ad_banners FOR SELECT
USING (is_active = true);

-- Admins can manage ads
CREATE POLICY "Admins can view all ads"
ON public.ad_banners FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert ads"
ON public.ad_banners FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update ads"
ON public.ad_banners FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete ads"
ON public.ad_banners FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add sponsored and affiliate columns to opportunities
ALTER TABLE public.opportunities
  ADD COLUMN IF NOT EXISTS sponsored BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS affiliate_url TEXT,
  ADD COLUMN IF NOT EXISTS affiliate_label TEXT DEFAULT 'Enroll Now';

-- Update trigger for ad_banners
CREATE TRIGGER update_ad_banners_updated_at
  BEFORE UPDATE ON public.ad_banners
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
