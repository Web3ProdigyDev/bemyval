-- Create analytics table for tracking visitor interactions
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL, -- 'visit', 'interaction', 'yes_click', 'no_click', 'custom_text'
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create custom wishes table
CREATE TABLE IF NOT EXISTS public.custom_wishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_name TEXT NOT NULL,
  custom_text TEXT,
  sender_name TEXT,
  custom_title TEXT DEFAULT 'This Moment Is Everything!',
  custom_subtitle TEXT DEFAULT 'You''re my favorite person, and now it''s official! 💖',
  custom_message TEXT DEFAULT 'My heart is yours! 🌹',
  custom_closing TEXT DEFAULT 'With all my love! 🌹',
  custom_footer TEXT DEFAULT 'Made with 💕 by Inspired Devs',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create shared letters tracking table
CREATE TABLE IF NOT EXISTS public.shared_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wish_id UUID REFERENCES public.custom_wishes(id) ON DELETE CASCADE,
  share_url TEXT NOT NULL UNIQUE,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS but allow public access (since we want analytics to work without auth)
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_letters ENABLE ROW LEVEL SECURITY;

-- Analytics: Allow anyone to insert (anonymous tracking)
CREATE POLICY "analytics_insert_public" ON public.analytics 
  FOR INSERT 
  WITH CHECK (true);

-- Analytics: Allow anyone to read (for admin dashboard)
CREATE POLICY "analytics_select_public" ON public.analytics 
  FOR SELECT 
  USING (true);

-- Custom wishes: Allow anyone to read
CREATE POLICY "custom_wishes_select_public" ON public.custom_wishes 
  FOR SELECT 
  USING (true);

-- Custom wishes: Allow insert for admin (we'll handle this in app logic)
CREATE POLICY "custom_wishes_insert_public" ON public.custom_wishes 
  FOR INSERT 
  WITH CHECK (true);

-- Custom wishes: Allow update for admin
CREATE POLICY "custom_wishes_update_public" ON public.custom_wishes 
  FOR UPDATE 
  USING (true);

-- Custom wishes: Allow delete for admin
CREATE POLICY "custom_wishes_delete_public" ON public.custom_wishes 
  FOR DELETE 
  USING (true);

-- Shared letters: Allow anyone to read
CREATE POLICY "shared_letters_select_public" ON public.shared_letters 
  FOR SELECT 
  USING (true);

-- Shared letters: Allow anyone to insert
CREATE POLICY "shared_letters_insert_public" ON public.shared_letters 
  FOR INSERT 
  WITH CHECK (true);

-- Shared letters: Allow anyone to update (for view counts)
CREATE POLICY "shared_letters_update_public" ON public.shared_letters 
  FOR UPDATE 
  USING (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON public.analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_shared_letters_url ON public.shared_letters(share_url);
