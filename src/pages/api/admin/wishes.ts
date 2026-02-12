import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

interface CustomWish {
  id?: string;
  title: string;
  subtitle: string;
  main_message: string;
  heart_message: string;
  love_message: string;
  footer_message: string;
  website_name: string;
  is_default?: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.headers.authorization?.split('Bearer ')[1];

  // Verify admin token
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    if (req.method === 'GET') {
      // Fetch all wishes
      const { data, error } = await supabase
        .from('custom_wishes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      // Create new wish
      const wish: CustomWish = req.body;

      const { data, error } = await supabase
        .from('custom_wishes')
        .insert([wish])
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      // Update wish
      const { id, ...updateData } = req.body;

      const { data, error } = await supabase
        .from('custom_wishes')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      // Delete wish
      const { id } = req.body;

      const { error } = await supabase
        .from('custom_wishes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[v0] API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
