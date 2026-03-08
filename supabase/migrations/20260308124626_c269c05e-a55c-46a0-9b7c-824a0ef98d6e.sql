ALTER TABLE public.opportunities
  ADD COLUMN about_org text,
  ADD COLUMN job_description_full text,
  ADD COLUMN job_requirements text,
  ADD COLUMN work_experience text,
  ADD COLUMN submission_guidelines text;