import { supabase } from './supabase';

export async function createLocationsTable() {
  try {
    // Create the locations table
    const { error: tableError } = await supabase.rpc('create_locations_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS locations (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          city VARCHAR(255) NOT NULL,
          country VARCHAR(255) NOT NULL,
          coordinates JSONB NOT NULL DEFAULT '{"lat": 0, "lng": 0}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        -- Create index for faster searches
        CREATE INDEX IF NOT EXISTS idx_locations_name ON locations(name);
        CREATE INDEX IF NOT EXISTS idx_locations_city ON locations(city);
        CREATE INDEX IF NOT EXISTS idx_locations_country ON locations(country);

        -- Add trigger to update updated_at timestamp
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ language 'plpgsql';

        CREATE TRIGGER update_locations_updated_at
            BEFORE UPDATE ON locations
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
      `
    });

    if (tableError) {
      console.error('Error creating locations table:', tableError);
      return false;
    }

    console.log('✅ Locations table created successfully');
    return true;
  } catch (err) {
    console.error('Error in createLocationsTable:', err);
    return false;
  }
}

export async function verifyLocationsTable() {
  try {
    // Check if the locations table exists
    const { data, error } = await supabase
      .from('locations')
      .select('id')
      .limit(1);

    if (error) {
      if (error.message.includes('does not exist')) {
        console.log('Locations table does not exist, creating it...');
        return createLocationsTable();
      }
      throw error;
    }

    console.log('✅ Locations table exists');
    return true;
  } catch (err) {
    console.error('Error verifying locations table:', err);
    return false;
  }
} 