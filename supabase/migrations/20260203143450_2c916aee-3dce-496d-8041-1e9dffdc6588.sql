-- Create storage bucket for deposit proofs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('deposit-proofs', 'deposit-proofs', false);

-- Create storage policies for deposit proofs
CREATE POLICY "Users can upload their own deposit proofs"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'deposit-proofs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own deposit proofs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'deposit-proofs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Add screenshot_url column to deposits table
ALTER TABLE public.deposits 
ADD COLUMN IF NOT EXISTS screenshot_url text;