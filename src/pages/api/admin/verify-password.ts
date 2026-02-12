import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

const ADMIN_PASSWORD = 'iamgodwinhaha';
const SECRET_KEY = process.env.SUPABASE_JWT_SECRET || 'default-secret-key';

interface Response {
  token?: string;
  error?: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password required' });
  }

  if (password !== ADMIN_PASSWORD) {
    // Add a small delay to prevent brute force
    return res.status(401).json({ error: 'Invalid password' });
  }

  // Generate a simple token (in production, use JWT)
  const token = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(`${Date.now()}-admin-token`)
    .digest('hex');

  return res.status(200).json({ token });
}
