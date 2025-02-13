-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT UNIQUE,
    role TEXT CHECK (role IN ('owner', 'customer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    coordinates JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(city, country)
);

-- Create retreat_types table
CREATE TABLE IF NOT EXISTS retreat_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create retreats table
CREATE TABLE IF NOT EXISTS retreats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location_id UUID REFERENCES locations(id) ON DELETE RESTRICT,
    price JSONB NOT NULL,
    duration INTEGER NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    type TEXT[] NOT NULL,
    amenities TEXT[] NOT NULL,
    images TEXT[] NOT NULL,
    host_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    rating FLOAT DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    retreat_id UUID REFERENCES retreats(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    total_price NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    retreat_id UUID REFERENCES retreats(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(retreat_id, user_id)
);

-- Create RLS Policies

-- Profiles policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- Locations policies
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Locations are viewable by everyone"
    ON locations FOR SELECT
    USING (true);

CREATE POLICY "Only authenticated users can insert locations"
    ON locations FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Retreat types policies
ALTER TABLE retreat_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Retreat types are viewable by everyone"
    ON retreat_types FOR SELECT
    USING (true);

CREATE POLICY "Only authenticated users can insert retreat types"
    ON retreat_types FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Retreats policies
ALTER TABLE retreats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Retreats are viewable by everyone"
    ON retreats FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own retreats"
    ON retreats FOR INSERT
    WITH CHECK (auth.uid()::text = host_id::text);

CREATE POLICY "Users can update own retreats"
    ON retreats FOR UPDATE
    USING (auth.uid()::text = host_id::text);

CREATE POLICY "Users can delete own retreats"
    ON retreats FOR DELETE
    USING (auth.uid()::text = host_id::text);

-- Bookings policies
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings"
    ON bookings FOR SELECT
    USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own bookings"
    ON bookings FOR INSERT
    WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own bookings"
    ON bookings FOR UPDATE
    USING (auth.uid()::text = user_id::text);

-- Reviews policies
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone"
    ON reviews FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own reviews"
    ON reviews FOR INSERT
    WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own reviews"
    ON reviews FOR UPDATE
    USING (auth.uid()::text = user_id::text);

-- Create functions

-- Function to update retreat ratings
CREATE OR REPLACE FUNCTION update_retreat_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE retreats
    SET 
        rating = (
            SELECT AVG(rating)::float
            FROM reviews
            WHERE retreat_id = NEW.retreat_id
        ),
        review_count = (
            SELECT COUNT(*)
            FROM reviews
            WHERE retreat_id = NEW.retreat_id
        )
    WHERE id = NEW.retreat_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating retreat ratings
CREATE TRIGGER update_retreat_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_retreat_rating(); 