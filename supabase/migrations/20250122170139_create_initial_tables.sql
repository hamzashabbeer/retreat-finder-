-- Function to check if a policy exists
CREATE OR REPLACE FUNCTION policy_exists(
    policy_name text,
    table_name text,
    schema_name text DEFAULT 'public'
) RETURNS boolean AS $$
BEGIN
    -- First check if the table exists
    IF NOT EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = schema_name
        AND tablename = table_name
    ) THEN
        RETURN false;
    END IF;

    RETURN EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE policyname = policy_name
        AND tablename = table_name
        AND schemaname = schema_name
    );
END;
$$ LANGUAGE plpgsql;

-- Create or replace the updated_at trigger function first
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create all tables first
DO $$ BEGIN
    -- Create profiles table if it doesn't exist
    IF NOT EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename = 'profiles'
    ) THEN
        CREATE TABLE profiles (
            id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
            role TEXT NOT NULL CHECK (role IN ('owner', 'customer')),
            full_name TEXT,
            avatar_url TEXT,
            business_name TEXT,
            phone_number TEXT,
            website TEXT,
            description TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );

        -- Enable RLS for profiles immediately after creation
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

        -- Create profiles policies immediately after creation
        CREATE POLICY "Public profiles are viewable by everyone"
            ON profiles FOR SELECT
            USING (true);

        CREATE POLICY "Users can update own profile"
            ON profiles FOR UPDATE
            USING (auth.uid() = id);

        -- Create trigger for profiles immediately after creation
        CREATE TRIGGER update_profiles_updated_at
            BEFORE UPDATE ON profiles
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- Create retreats table if it doesn't exist
    IF NOT EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename = 'retreats'
    ) THEN
        CREATE TABLE retreats (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            location JSONB NOT NULL,
            price JSONB NOT NULL,
            duration INTEGER NOT NULL,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            type TEXT[] NOT NULL,
            amenities TEXT[] NOT NULL,
            images TEXT[] NOT NULL,
            host_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
            rating FLOAT DEFAULT 0,
            review_count INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
            CONSTRAINT valid_dates CHECK (end_date >= start_date),
            CONSTRAINT valid_duration CHECK (duration > 0)
        );

        -- Enable RLS for retreats immediately after creation
        ALTER TABLE retreats ENABLE ROW LEVEL SECURITY;

        -- Create retreats policies immediately after creation
        CREATE POLICY "Retreats are viewable by everyone"
            ON retreats FOR SELECT
            USING (true);

        CREATE POLICY "Owners can insert their own retreats"
            ON retreats FOR INSERT
            WITH CHECK (
                auth.uid() = host_id
                AND EXISTS (
                    SELECT 1 FROM profiles
                    WHERE id = auth.uid()
                    AND role = 'owner'
                )
            );

        CREATE POLICY "Owners can update their own retreats"
            ON retreats FOR UPDATE
            USING (auth.uid() = host_id);

        CREATE POLICY "Owners can delete their own retreats"
            ON retreats FOR DELETE
            USING (auth.uid() = host_id);

        -- Create trigger for retreats immediately after creation
        CREATE TRIGGER update_retreats_updated_at
            BEFORE UPDATE ON retreats
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- Create bookings table if it doesn't exist
    IF NOT EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename = 'bookings'
    ) THEN
        CREATE TABLE bookings (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            retreat_id UUID REFERENCES retreats(id) ON DELETE CASCADE NOT NULL,
            customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            total_price NUMERIC NOT NULL,
            status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
            CONSTRAINT valid_booking_dates CHECK (end_date >= start_date)
        );

        -- Enable RLS for bookings immediately after creation
        ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

        -- Create bookings policies immediately after creation
        CREATE POLICY "Users can view their own bookings"
            ON bookings FOR SELECT
            USING (
                auth.uid() = customer_id
                OR auth.uid() IN (
                    SELECT host_id FROM retreats WHERE id = retreat_id
                )
            );

        CREATE POLICY "Customers can create bookings"
            ON bookings FOR INSERT
            WITH CHECK (
                auth.uid() = customer_id
                AND EXISTS (
                    SELECT 1 FROM profiles
                    WHERE id = auth.uid()
                    AND role = 'customer'
                )
            );

        CREATE POLICY "Users can update their own bookings"
            ON bookings FOR UPDATE
            USING (
                auth.uid() = customer_id
                OR auth.uid() IN (
                    SELECT host_id FROM retreats WHERE id = retreat_id
                )
            );

        -- Create trigger for bookings immediately after creation
        CREATE TRIGGER update_bookings_updated_at
            BEFORE UPDATE ON bookings
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;
