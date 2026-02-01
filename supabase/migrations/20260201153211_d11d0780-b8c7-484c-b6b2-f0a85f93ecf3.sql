-- Create table for valentine visitors
CREATE TABLE public.valentine_visitors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.valentine_visitors ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (since visitors aren't authenticated)
CREATE POLICY "Anyone can submit their info"
  ON public.valentine_visitors
  FOR INSERT
  WITH CHECK (true);

-- Only allow reading through backend/admin (no public read access)
CREATE POLICY "No public read access"
  ON public.valentine_visitors
  FOR SELECT
  USING (false);