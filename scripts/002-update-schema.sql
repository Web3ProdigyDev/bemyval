-- Update custom_wishes table to match the expected schema
ALTER TABLE public.custom_wishes 
ADD COLUMN IF NOT EXISTS title TEXT DEFAULT 'This Moment Is Everything!',
ADD COLUMN IF NOT EXISTS subtitle TEXT DEFAULT 'You''re my favorite person, and now it''s official! 💖',
ADD COLUMN IF NOT EXISTS main_message TEXT DEFAULT 'My heart is yours! 🌹',
ADD COLUMN IF NOT EXISTS heart_message TEXT DEFAULT 'With all my love! 🌹',
ADD COLUMN IF NOT EXISTS love_message TEXT DEFAULT 'Made with 💕 by Inspired Devs',
ADD COLUMN IF NOT EXISTS footer_message TEXT DEFAULT 'WebsiteChat',
ADD COLUMN IF NOT EXISTS website_name TEXT DEFAULT 'BeMyVal',
ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT false;

-- Remove old columns if they exist (keeping backwards compatibility)
-- ALTER TABLE public.custom_wishes DROP COLUMN IF EXISTS custom_title;
-- ALTER TABLE public.custom_wishes DROP COLUMN IF EXISTS custom_subtitle;
-- ALTER TABLE public.custom_wishes DROP COLUMN IF EXISTS custom_message;
-- ALTER TABLE public.custom_wishes DROP COLUMN IF EXISTS custom_closing;
-- ALTER TABLE public.custom_wishes DROP COLUMN IF EXISTS custom_footer;
