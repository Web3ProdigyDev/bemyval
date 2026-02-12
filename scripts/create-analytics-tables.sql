-- Create valentine_analytics table for tracking visitor interactions
CREATE TABLE IF NOT EXISTS valentine_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  
  -- User info (optional - only when shared)
  recipient_name TEXT,
  sender_name TEXT,
  custom_message TEXT,
  
  -- Interaction tracking
  page_view BOOLEAN DEFAULT FALSE,
  said_yes BOOLEAN DEFAULT FALSE,
  said_no_count INT DEFAULT 0,
  shared BOOLEAN DEFAULT FALSE,
  screen_changes TEXT[], -- Array of screens visited in order
  
  -- Lightweight tracking
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_interaction TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- For cleanup (auto-delete old records)
  CONSTRAINT analytics_session_id_check CHECK (session_id != '')
);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_analytics_session_id ON valentine_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON valentine_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_said_yes ON valentine_analytics(said_yes);
CREATE INDEX IF NOT EXISTS idx_analytics_shared ON valentine_analytics(shared);

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_valentine_analytics_updated_at
BEFORE UPDATE ON valentine_analytics
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Keep the existing valentine_visitors table but add more fields
ALTER TABLE valentine_visitors ADD COLUMN IF NOT EXISTS custom_text TEXT;
ALTER TABLE valentine_visitors ADD COLUMN IF NOT EXISTS recipient_name TEXT;
ALTER TABLE valentine_visitors ADD COLUMN IF NOT EXISTS sender_name TEXT;

-- Create a cleanup job to remove old analytics (keep only last 30 days)
-- This prevents database bloat while maintaining recent data
CREATE OR REPLACE FUNCTION cleanup_old_analytics()
RETURNS void AS $$
BEGIN
  DELETE FROM valentine_analytics
  WHERE created_at < NOW() - INTERVAL '30 days'
  AND session_id NOT IN (
    SELECT DISTINCT session_id FROM valentine_analytics 
    ORDER BY created_at DESC 
    LIMIT 10000 -- Keep at least 10k recent records
  );
END;
$$ LANGUAGE plpgsql;
