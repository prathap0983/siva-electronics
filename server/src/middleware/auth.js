import { supabase } from '../config/supabase.js';

export const requireAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header is missing or malformed' });
    }

    const token = authHeader.split(' ')[1];
    
    // 1. Get user details from Supabase Auth using the token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return res.status(410).json({ error: 'Session expired or invalid token. Please log in again.' });
    }

    // 2. Check if the user is in the admins table
    const { data: admin, error: dbError } = await supabase
      .from('admins')
      .select('id, email')
      .eq('id', user.id)
      .single();

    if (dbError || !admin) {
      return res.status(403).json({ error: 'Access denied. Authorized administrators only.' });
    }

    // Attach admin details to request
    req.user = {
      id: user.id,
      email: user.email,
      role: 'admin'
    };

    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
};
