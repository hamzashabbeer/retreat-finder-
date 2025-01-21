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

// Test connection function
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('count').single();
    if (error) {
      console.error('Supabase connection test failed:', error.message);
      return false;
    }
    console.log('Supabase connection successful!');
    return true;
  } catch (err) {
    console.error('Error testing Supabase connection:', err);
    return false;
  }
};

// Function to test connection and insert a test retreat
export const testSupabaseAndInsertRetreat = async () => {
  try {
    console.log('Testing Supabase connection...');
    
    // First, test the connection by getting the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    
    console.log('Connection successful, current user:', user?.id || 'No user logged in');
    
    // Check if the retreats table exists by trying to select from it
    const { data: existingRetreats, error: selectError } = await supabase
      .from('retreats')
      .select('id')
      .limit(1);
      
    if (selectError) throw selectError;
    
    console.log('Retreats table exists, current count:', existingRetreats?.length || 0);
    
    // Insert a test retreat
    const testRetreat = {
      title: "Test Mountain Retreat",
      description: "A beautiful test retreat in the mountains",
      location: {
        city: "Swiss Alps",
        country: "Switzerland",
        coordinates: {
          lat: 46.8182,
          lng: 8.2275
        }
      },
      price: {
        amount: 299,
        currency: "USD"
      },
      duration: 7,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      type: ["Meditation", "Yoga"],
      amenities: ["Mountain View", "Spa", "Organic Meals"],
      images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d"],
      hostId: user?.id || 'test-host',
      rating: 4.8,
      reviewCount: 24
    };
    
    const { data: insertedRetreat, error: insertError } = await supabase
      .from('retreats')
      .insert([testRetreat])
      .select()
      .single();
      
    if (insertError) throw insertError;
    
    console.log('Successfully inserted test retreat:', insertedRetreat);
    return true;
  } catch (error) {
    console.error('Error in Supabase test:', error);
    return false;
  }
};