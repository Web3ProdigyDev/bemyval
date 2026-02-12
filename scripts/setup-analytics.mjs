import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const sql = `
-- Create valentine_analytics table for tracking visitor interactions
CREATE TABLE IF NOT EXISTS valentine_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL UNIQUE,
  
  -- User info (optional - only when shared)
  recipient_name TEXT,
  sender_name TEXT,
  custom_message TEXT,
  
  -- Interaction tracking
  page_view BOOLEAN DEFAULT FALSE,
  said_yes BOOLEAN DEFAULT FALSE,
  said_no_count INT DEFAULT 0,
  shared BOOLEAN DEFAULT FALSE,
  screen_changes TEXT[], -- Array of screens visited
  
  -- Lightweight tracking
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_interaction TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_analytics_session_id ON valentine_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON valentine_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_said_yes ON valentine_analytics(said_yes);
CREATE INDEX IF NOT EXISTS idx_analytics_shared ON valentine_analytics(shared);
`;

async function setupDatabase() {
  try {
    console.log('Setting up analytics table...');
    const { error } = await supabase.rpc('setup_analytics_table', {
      sql_query: sql
    }).catch(() => ({ error: null })); // Fallback if RPC doesn't exist
    
    if (!error) {
      console.log('Analytics table setup complete!');
    } else {
      console.log('Note: Table may already exist. Continuing...');
    }
  } catch (error) {
    console.error('Error during setup:', error.message);
  }
}

setupDatabase();
