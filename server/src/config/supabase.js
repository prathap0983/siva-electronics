import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

export let supabase;

// Graceful check to allow the backend to boot and log health stats even if .env is not yet configured
if (
  supabaseUrl && 
  supabaseServiceKey && 
  supabaseUrl !== 'your_supabase_url' && 
  supabaseServiceKey !== 'your_supabase_anon_key'
) {
  supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
} else {
  console.warn('========================================================================');
  console.warn(' WARNING: Supabase URL or Key is missing or default. ');
  console.warn(' Siva Electronics API is operating in OFFLINE MOCK MODE. ');
  console.warn(' Please update your server/.env file with live Supabase credentials. ');
  console.warn('========================================================================');
  
  // Return a safe mockup database interface to prevent server crash during boot / build checks
  supabase = {
    auth: {
      getUser: async () => ({ data: { user: null }, error: new Error('Database offline') }),
      signInWithPassword: async () => ({ data: { user: null }, error: new Error('Database offline') }),
      signOut: async () => ({})
    },
    from: () => {
      const mockResult = {
        select: () => mockResult,
        insert: () => mockResult,
        update: () => mockResult,
        delete: () => mockResult,
        eq: () => mockResult,
        order: () => mockResult,
        limit: () => mockResult,
        range: () => Promise.resolve({ data: [], count: 0, error: null }),
        single: () => Promise.resolve({ data: null, error: null }),
        then: (resolve) => resolve({ data: [], count: 0, error: null })
      };
      return mockResult;
    }
  };
}
export default supabase;
