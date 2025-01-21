import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  throw new Error(`Invalid VITE_SUPABASE_URL: ${supabaseUrl}`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Test connection function with detailed error reporting
export const testSupabaseConnection = async () => {
  console.log('Testing Supabase connection...');
  console.log('Using URL:', supabaseUrl);
  console.log('Anon Key exists:', !!supabaseAnonKey);
  
  try {
    // First try a simple health check
    const { error: healthError } = await supabase.from('profiles').select('count');
    if (healthError) {
      console.error('Health check failed:', healthError);
      return false;
    }

    // Try to get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('Session check:', { session, error: sessionError });

    // Try a simple query
    const { error: queryError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
      
    if (queryError) {
      console.error('Query test failed:', {
        error: queryError.message,
        details: queryError.details,
        hint: queryError.hint
      });
      return false;
    }
    
    console.log('Supabase connection successful!');
    return true;
  } catch (err) {
    console.error('Error testing Supabase connection:', err);
    return false;
  }
};