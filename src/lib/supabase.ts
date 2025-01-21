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
    const { data: tableData, error: tableError } = await supabase
      .from('profiles')
      .select('id, role, full_name')
      .limit(1);

    if (tableError) {
      console.error('Table check failed:', {
        error: tableError.message,
        details: tableError.details,
        hint: tableError.hint,
        code: tableError.code
      });
      return false;
    }

    console.log('Table structure check:', { tableData });

    // Try to get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('Session check:', { 
      hasSession: !!session,
      sessionError: sessionError?.message
    });

    if (session) {
      // If we have a session, try to get the user's profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      console.log('Profile check:', {
        hasProfile: !!profileData,
        role: profileData?.role,
        error: profileError?.message
      });
    }
    
    console.log('Supabase connection successful!');
    return true;
  } catch (err) {
    console.error('Error testing Supabase connection:', err);
    return false;
  }
};