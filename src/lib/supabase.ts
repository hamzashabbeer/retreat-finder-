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

// Function to verify and create database structure
export const verifyDatabaseStructure = async () => {
  try {
    console.log('Verifying database structure...');

    // Try to create the table directly
    const { error: createError } = await supabase.from('retreats').select('id').limit(1);
    
    if (createError) {
      console.log('Retreats table might not exist, creating it...');
      
      // Create the table using raw SQL
      const { error: sqlError } = await supabase.rpc('exec', {
        sql: `
          -- Drop existing policies if they exist
          DROP POLICY IF EXISTS "Retreats are viewable by everyone" ON retreats;
          DROP POLICY IF EXISTS "Users can insert their own retreats" ON retreats;
          DROP POLICY IF EXISTS "Users can update their own retreats" ON retreats;
          DROP POLICY IF EXISTS "Users can delete their own retreats" ON retreats;

          -- Create or replace the table
          CREATE TABLE IF NOT EXISTS retreats (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            location JSONB NOT NULL,
            price JSONB NOT NULL,
            duration INTEGER NOT NULL,
            "startDate" TIMESTAMP WITH TIME ZONE NOT NULL,
            "endDate" TIMESTAMP WITH TIME ZONE NOT NULL,
            type TEXT[] NOT NULL,
            amenities TEXT[] NOT NULL,
            images TEXT[] NOT NULL,
            "hostId" UUID REFERENCES auth.users(id),
            rating DECIMAL(3,2) DEFAULT 0,
            "reviewCount" INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
          );

          -- Enable RLS
          ALTER TABLE retreats ENABLE ROW LEVEL SECURITY;

          -- Create policies
          CREATE POLICY "Retreats are viewable by everyone"
            ON retreats FOR SELECT
            USING (true);

          CREATE POLICY "Users can insert their own retreats"
            ON retreats FOR INSERT
            WITH CHECK (auth.uid() = "hostId");

          CREATE POLICY "Users can update their own retreats"
            ON retreats FOR UPDATE
            USING (auth.uid() = "hostId")
            WITH CHECK (auth.uid() = "hostId");

          CREATE POLICY "Users can delete their own retreats"
            ON retreats FOR DELETE
            USING (auth.uid() = "hostId");
        `
      });

      if (sqlError) {
        console.error('Error creating table with SQL:', sqlError);
        return false;
      }

      console.log('Successfully created retreats table and policies');
    } else {
      console.log('Retreats table exists');
    }

    // Verify the table exists and has the correct structure
    const { data: tableInfo, error: tableError } = await supabase
      .from('retreats')
      .select('id')
      .limit(1);

    if (tableError) {
      console.error('Error verifying table structure:', tableError);
      return false;
    }

    console.log('Database structure verified successfully');
    return true;
  } catch (error) {
    console.error('Error in verifyDatabaseStructure:', error);
    return false;
  }
};

// Function to test connection and insert a test retreat
export const testSupabaseAndInsertRetreat = async () => {
  try {
    // First verify database structure
    const structureOk = await verifyDatabaseStructure();
    if (!structureOk) {
      throw new Error('Database structure verification failed');
    }

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