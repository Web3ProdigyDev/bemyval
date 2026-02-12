import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('[v0] Setting up database tables...');

    // Create custom_wishes table
    const { error: wishesError } = await supabase
      .from('custom_wishes')
      .insert({
        title: 'This Moment Is Everything!',
        subtitle: "You're my favorite person, and now it's official! 💖",
        main_message: 'My heart is yours! 🌹',
        heart_message: 'With all my love! 🌹',
        love_message: 'Made with 💕 by Inspired Devs',
        footer_message: 'WebsiteChat',
        website_name: 'BeMyVal',
        is_default: true,
      })
      .select()
      .single();

    if (wishesError && wishesError.code !== 'PGRST116') {
      console.error('[v0] Error creating default wish:', wishesError);
    } else {
      console.log('[v0] Default wish created successfully');
    }

    console.log('[v0] Database setup complete!');
  } catch (error) {
    console.error('[v0] Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();
