
-- Add image_url column to opportunities
ALTER TABLE public.opportunities ADD COLUMN image_url text;

-- Create storage bucket for opportunity images
INSERT INTO storage.buckets (id, name, public) VALUES ('opportunity-images', 'opportunity-images', true);

-- Allow anyone to view opportunity images
CREATE POLICY "Anyone can view opportunity images"
ON storage.objects FOR SELECT
USING (bucket_id = 'opportunity-images');

-- Allow admins to upload opportunity images
CREATE POLICY "Admins can upload opportunity images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'opportunity-images'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Allow admins to update opportunity images
CREATE POLICY "Admins can update opportunity images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'opportunity-images'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Allow admins to delete opportunity images
CREATE POLICY "Admins can delete opportunity images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'opportunity-images'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);
