
-- Create opportunities table for all types
CREATE TABLE public.opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Scholarship', 'Internship', 'Course', 'Webinar')),
  location TEXT,
  deadline TEXT,
  duration TEXT,
  provider TEXT,
  link TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  speaker TEXT,
  event_date TEXT,
  event_time TEXT,
  attendees INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view opportunities"
  ON public.opportunities FOR SELECT
  USING (true);

-- Create index for category filtering
CREATE INDEX idx_opportunities_category ON public.opportunities(category);

-- Create timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_opportunities_updated_at
  BEFORE UPDATE ON public.opportunities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
