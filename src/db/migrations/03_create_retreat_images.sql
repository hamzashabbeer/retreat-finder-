-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create retreat_images table
CREATE TABLE IF NOT EXISTS public.retreat_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.retreat_images ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access" ON public.retreat_images;
DROP POLICY IF EXISTS "Allow authenticated create" ON public.retreat_images;

-- Create policies for retreat_images table
CREATE POLICY "Allow public read access"
    ON public.retreat_images
    FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated create"
    ON public.retreat_images
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Create and configure storage bucket
DO $$
BEGIN
    -- Create the storage bucket if it doesn't exist
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
        'retreat-images',
        'retreat-images',
        true,
        5242880, -- 5MB in bytes
        ARRAY['image/png', 'image/jpeg', 'image/webp']
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        public = true,
        file_size_limit = 5242880,
        allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp'];

    -- Drop existing storage policies if they exist
    DELETE FROM storage.policies 
    WHERE bucket_id = 'retreat-images' 
    AND name IN ('Public Read Access', 'Authenticated Upload');

    -- Create storage policies
    -- Allow public read access to files
    INSERT INTO storage.policies (name, bucket_id, definition)
    VALUES (
        'Public Read Access',
        'retreat-images',
        '{"name": "Public Read Access", "owner": null, "statements": [{"action": "SELECT", "effect": "ALLOW", "principal": "*"}]}'::jsonb
    );

    -- Allow authenticated users to upload files
    INSERT INTO storage.policies (name, bucket_id, definition)
    VALUES (
        'Authenticated Upload',
        'retreat-images',
        '{"name": "Authenticated Upload", "owner": null, "statements": [{"action": "INSERT", "effect": "ALLOW", "condition": "role = ''authenticated''"}]}'::jsonb
    );
END $$; 