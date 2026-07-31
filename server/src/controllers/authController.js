import { supabase } from '../config/supabase.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // 1. Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error || !data.user) {
      return res.status(401).json({ error: error?.message || 'Invalid email or password' });
    }

    const user = data.user;

    // 2. Check if there are any admins in the database
    const { count, error: countError } = await supabase
      .from('admins')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error counting admins:', countError);
    }

    // 3. Smart Setup: If there are 0 admins, auto-promote the first user who successfully authenticates
    if (count === 0) {
      console.log(`Smart Setup: Registering first admin user: ${user.email}`);
      const { error: insertError } = await supabase
        .from('admins')
        .insert({ id: user.id, email: user.email });

      if (insertError) {
        console.error('Error auto-registering first admin:', insertError);
        return res.status(500).json({ error: 'Failed to initialize administrator profile' });
      }
    } else {
      // Check if this user is in the admins table
      const { data: admin, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('id', user.id)
        .single();

      if (adminError || !admin) {
        // Sign user out of Supabase Auth to keep state consistent
        await supabase.auth.signOut();
        return res.status(403).json({ error: 'Access denied. You do not have administrator privileges.' });
      }
    }

    // 4. Return token, session info, and user metadata
    res.status(200).json({
      message: 'Admin login successful',
      token: data.session.access_token,
      user: {
        id: user.id,
        email: user.email,
        role: 'admin'
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    // req.user was populated by requireAdmin middleware
    res.status(200).json({ user: req.user });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await supabase.auth.signOut();
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};
