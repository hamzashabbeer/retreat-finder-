import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (err) {
  throw new Error('Invalid VITE_SUPABASE_URL format');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

export async function verifyAndCreateLocationsTable() {
  try {
    // First, check if the locations table exists
    const { data, error: checkError } = await supabase
      .from('locations')
      .select('id')
      .limit(1);

    // If we get data or an error that's not "doesn't exist", the table exists
    if (data || (checkError && !checkError.message.includes('does not exist'))) {
      console.log('Locations table already exists');
      return true;
    }

    // If we get here, we need to create the table and insert sample data
    console.log('Creating locations table and inserting sample data...');

    // Insert sample locations directly
    const { error: insertError } = await supabase
      .from('locations')
      .insert([
        { city: 'Bali', country: 'Indonesia' },
        { city: 'Rishikesh', country: 'India' },
        { city: 'Tulum', country: 'Mexico' },
        { city: 'Sedona', country: 'United States' },
        { city: 'Ubud', country: 'Indonesia' },
        { city: 'Chiang Mai', country: 'Thailand' },
        { city: 'Cusco', country: 'Peru' },
        { city: 'Byron Bay', country: 'Australia' }
      ]);

    if (insertError) {
      console.error('Error inserting sample locations:', insertError);
      return false;
    }

    console.log('Successfully created locations table and inserted sample data');
    return true;
  } catch (err) {
    console.error('Error in verifyAndCreateLocationsTable:', err);
    return false;
  }
}

export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('locations').select('count').single();
    return !error;
  } catch (err) {
    console.error('Error testing Supabase connection:', err);
    return false;
  }
}

/**
 * Verifies and sets up the necessary database structure
 * This includes creating tables and setting up RLS policies
 */
export const verifyDatabaseStructure = async () => {
  try {
    console.log('Verifying database structure...');

    // Drop existing tables if they exist
    const { error: dropBookingsError } = await supabase.rpc('drop_table_if_exists', {
      table_name: 'bookings'
    });

    if (dropBookingsError && !dropBookingsError.message.includes('does not exist')) {
      console.error('Error dropping bookings table:', dropBookingsError);
    }

    const { error: dropRetreatsError } = await supabase.rpc('drop_table_if_exists', {
      table_name: 'retreats'
    });

    if (dropRetreatsError && !dropRetreatsError.message.includes('does not exist')) {
      console.error('Error dropping retreats table:', dropRetreatsError);
    }

    // Create retreats table
    const { error: createRetreatsError } = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'retreats',
      table_definition: `
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        location JSONB NOT NULL,
        price JSONB NOT NULL,
        duration INTEGER NOT NULL,
        startDate DATE NOT NULL,
        endDate DATE NOT NULL,
        type TEXT[] NOT NULL,
        amenities TEXT[] NOT NULL,
        images TEXT[] NOT NULL,
        hostId UUID NOT NULL,
        rating FLOAT DEFAULT 0,
        reviewCount INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      `
    });

    if (createRetreatsError) {
      console.error('Error creating retreats table:', createRetreatsError);
      throw createRetreatsError;
    }

    // Create bookings table
    const { error: createBookingsError } = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'bookings',
      table_definition: `
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        retreatId UUID NOT NULL REFERENCES retreats(id) ON DELETE CASCADE,
        userId UUID NOT NULL,
        startDate DATE NOT NULL,
        endDate DATE NOT NULL,
        totalPrice NUMERIC NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      `
    });

    if (createBookingsError) {
      console.error('Error creating bookings table:', createBookingsError);
      throw createBookingsError;
    }

    // Drop existing policies
    const { error: dropRetreatsSelectError } = await supabase.rpc('drop_policy_if_exists', {
      table_name: 'retreats',
      policy_name: 'retreats_select_policy'
    });

    if (dropRetreatsSelectError && !dropRetreatsSelectError.message.includes('does not exist')) {
      console.error('Error dropping retreats select policy:', dropRetreatsSelectError);
    }

    const { error: dropRetreatsInsertError } = await supabase.rpc('drop_policy_if_exists', {
      table_name: 'retreats',
      policy_name: 'retreats_insert_policy'
    });

    if (dropRetreatsInsertError && !dropRetreatsInsertError.message.includes('does not exist')) {
      console.error('Error dropping retreats insert policy:', dropRetreatsInsertError);
    }

    // Create policies
    const { error: createRetreatsSelectError } = await supabase.rpc('create_policy', {
      table_name: 'retreats',
      policy_name: 'retreats_select_policy',
      policy_definition: `
        CREATE POLICY retreats_select_policy ON retreats
        FOR SELECT USING (true)
      `
    });

    if (createRetreatsSelectError) {
      console.error('Error creating retreats select policy:', createRetreatsSelectError);
      throw createRetreatsSelectError;
    }

    const { error: createRetreatsInsertError } = await supabase.rpc('create_policy', {
      table_name: 'retreats',
      policy_name: 'retreats_insert_policy',
      policy_definition: `
        CREATE POLICY retreats_insert_policy ON retreats
        FOR INSERT WITH CHECK (auth.uid() IS NOT NULL)
      `
    });

    if (createRetreatsInsertError) {
      console.error('Error creating retreats insert policy:', createRetreatsInsertError);
      throw createRetreatsInsertError;
    }

    // Set up image storage
    await setupImageStorage();

    console.log('Database structure verified successfully');
    return true;
  } catch (err) {
    console.error('Error verifying database structure:', err);
    throw err;
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

export async function verifyAndCreateRetreatTypesTable() {
  try {
    // First, check if the retreat_types table exists
    const { data, error: checkError } = await supabase
      .from('retreat_types')
      .select('id')
      .limit(1);

    // If we get data or an error that's not "doesn't exist", the table exists
    if (data || (checkError && !checkError.message.includes('does not exist'))) {
      console.log('Retreat types table already exists');
      return true;
    }

    // If we get here, we need to create the table and insert sample data
    console.log('Creating retreat_types table and inserting sample data...');

    // Insert sample retreat types
    const { error: insertError } = await supabase
      .from('retreat_types')
      .insert([
        { name: 'Meditation', description: 'Focus on mindfulness and inner peace', icon: '🧘' },
        { name: 'Yoga', description: 'Traditional yoga practices and philosophy', icon: '🧘‍♀️' },
        { name: 'Wellness', description: 'Overall health and wellness programs', icon: '💆' },
        { name: 'Spiritual', description: 'Connect with your spiritual side', icon: '🕊️' },
        { name: 'Mental Health', description: 'Focus on mental wellbeing', icon: '🧠' },
        { name: 'Detox', description: 'Cleanse body and mind', icon: '🥗' },
        { name: 'Fitness', description: 'Physical fitness and training', icon: '💪' },
        { name: 'Silent', description: 'Practice silence and self-reflection', icon: '🤫' },
        { name: 'Couples', description: 'Strengthen relationships', icon: '💑' },
        { name: 'Weight Loss', description: 'Healthy weight management', icon: '⚖️' },
        { name: 'Healing', description: 'Natural healing and recovery', icon: '🌿' },
        { name: 'Ayurvedic', description: 'Traditional Ayurvedic practices', icon: '🪷' }
      ]);

    if (insertError) {
      console.error('Error inserting sample retreat types:', insertError);
      return false;
    }

    console.log('Successfully created retreat_types table and inserted sample data');
    return true;
  } catch (err) {
    console.error('Error in verifyAndCreateRetreatTypesTable:', err);
    return false;
  }
}

export async function setupImageStorage() {
  try {
    console.log('Setting up image storage...');

    // Create storage bucket if it doesn't exist
    const { error: storageError } = await supabase.storage.createBucket('retreat-images', {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp']
    });

    // Ignore error if bucket already exists
    if (storageError && !storageError.message.includes('already exists')) {
      console.error('Error creating storage bucket:', storageError);
      throw storageError;
    }

    console.log('Image storage setup completed successfully');
    return true;
  } catch (err) {
    console.error('Error setting up image storage:', err);
    return false;
  }
}