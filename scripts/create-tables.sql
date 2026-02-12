-- Create custom wishes table
CREATE TABLE IF NOT EXISTS custom_wishes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text NOT NULL,
  main_message text NOT NULL,
  heart_message text NOT NULL,
  love_message text NOT NULL,
  footer_message text NOT NULL,
  website_name text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  is_default boolean DEFAULT false
);

-- Create shared letters table
CREATE TABLE IF NOT EXISTS shared_letters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  recipient_name text,
  sender_name text,
  custom_message text,
  wish_id uuid REFERENCES custom_wishes(id),
  page_view boolean DEFAULT false,
  said_yes boolean DEFAULT false,
  said_no_count integer DEFAULT 0,
  shared boolean DEFAULT false,
  screen_changes text[] DEFAULT ARRAY[]::text[],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  last_interaction timestamp with time zone DEFAULT now()
);

-- Create admin logs table
CREATE TABLE IF NOT EXISTS admin_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  wish_id uuid REFERENCES custom_wishes(id),
  changes jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Insert default wish
INSERT INTO custom_wishes (title, subtitle, main_message, heart_message, love_message, footer_message, website_name, is_default)
VALUES (
  'This Moment Is Everything!',
  'You''re my favorite person, and now it''s official! 💖',
  'My heart is yours! 🌹',
  'With all my love! 🌹',
  'Made with 💕 by Inspired Devs',
  'WebsiteChat',
  'BeMyVal',
  true
)
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shared_letters_session_id ON shared_letters(session_id);
CREATE INDEX IF NOT EXISTS idx_shared_letters_wish_id ON shared_letters(wish_id);
CREATE INDEX IF NOT EXISTS idx_shared_letters_created_at ON shared_letters(created_at);
CREATE INDEX IF NOT EXISTS idx_custom_wishes_is_default ON custom_wishes(is_default);
