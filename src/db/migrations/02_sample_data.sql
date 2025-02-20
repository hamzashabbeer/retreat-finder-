-- Create a sample host profile first
INSERT INTO public.profiles (id, auth_user_id, full_name, email, role)
VALUES (
    '4883b65e-e402-44de-afb9-ba62b49cd601',
    '4883b65e-e402-44de-afb9-ba62b49cd601',
    'Retreat Host',
    'host@example.com',
    'owner'
);

-- Insert sample locations
INSERT INTO public.locations (city, country, coordinates)
VALUES 
    ('Bali', 'Indonesia', '{"lat": -8.4095, "lng": 115.1889}'::jsonb),
    ('Rishikesh', 'India', '{"lat": 30.0869, "lng": 78.2676}'::jsonb),
    ('Tulum', 'Mexico', '{"lat": 20.2114, "lng": -87.4654}'::jsonb),
    ('Sedona', 'United States', '{"lat": 34.8697, "lng": -111.7607}'::jsonb),
    ('Ubud', 'Indonesia', '{"lat": -8.5069, "lng": 115.2625}'::jsonb)
ON CONFLICT (city, country) DO NOTHING;

-- Insert sample retreat types
INSERT INTO public.retreat_types (name, description, icon)
VALUES 
    ('Meditation', 'Focus on mindfulness and inner peace', '🧘'),
    ('Yoga', 'Traditional yoga practices and philosophy', '🧘‍♀️'),
    ('Wellness', 'Overall health and wellness programs', '💆'),
    ('Spiritual', 'Connect with your spiritual side', '🕊️'),
    ('Mental Health', 'Focus on mental wellbeing', '🧠'),
    ('Detox', 'Cleanse body and mind', '🥗'),
    ('Fitness', 'Physical fitness and training', '💪'),
    ('Silent', 'Practice silence and self-reflection', '🤫'),
    ('Couples', 'Strengthen relationships', '💑'),
    ('Weight Loss', 'Healthy weight management', '⚖️'),
    ('Healing', 'Natural healing and recovery', '🌿'),
    ('Ayurvedic', 'Traditional Ayurvedic practices', '🪷')
ON CONFLICT (name) DO NOTHING;

-- Insert sample retreats
INSERT INTO public.retreats (
    title,
    description,
    location_id,
    price,
    duration,
    start_date,
    end_date,
    type,
    amenities,
    images,
    host_id,
    rating,
    review_count
)
SELECT
    retreat_data.title,
    retreat_data.description,
    (SELECT id FROM public.locations WHERE city = retreat_data.city LIMIT 1),
    retreat_data.price::jsonb,
    retreat_data.duration,
    retreat_data.start_date::timestamp with time zone,
    retreat_data.end_date::timestamp with time zone,
    retreat_data.type::text[],
    retreat_data.amenities::text[],
    retreat_data.images::text[],
    '4883b65e-e402-44de-afb9-ba62b49cd601'::uuid,
    retreat_data.rating,
    retreat_data.review_count
FROM (VALUES
    (
        'Sacred Valley Ayurvedic Retreat',
        'Experience traditional Ayurvedic healing in the heart of Bali',
        'Bali',
        '{"amount": 3499, "currency": "USD"}',
        14,
        CURRENT_DATE + INTERVAL '30 days',
        CURRENT_DATE + INTERVAL '44 days',
        ARRAY['Wellness', 'Meditation', 'Yoga'],
        ARRAY['Spa', 'Pool', 'Organic Meals', 'Yoga Studio'],
        ARRAY[
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
            'https://images.unsplash.com/photo-1596178065887-1198b6148b2b',
            'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2',
            'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0',
            'https://images.unsplash.com/photo-1613490493576-7fde63acd811',
            'https://images.unsplash.com/photo-1610375461246-83df859d849d'
        ],
        4.9,
        45
    ),
    (
        'Mindful Living Retreat',
        'Transform your life through mindfulness and meditation practices',
        'Ubud',
        '{"amount": 1999, "currency": "USD"}',
        7,
        CURRENT_DATE + INTERVAL '45 days',
        CURRENT_DATE + INTERVAL '52 days',
        ARRAY['Meditation', 'Spiritual'],
        ARRAY['Meditation Hall', 'Garden', 'Vegetarian Meals'],
        ARRAY[
            'https://images.unsplash.com/photo-1591228127791-8e2eaef098d3',
            'https://images.unsplash.com/photo-1518609878373-06d740f60d8b',
            'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d',
            'https://images.unsplash.com/photo-1510137600163-2729bc6927d3',
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
            'https://images.unsplash.com/photo-1433477155337-9aea4e790195'
        ],
        4.8,
        32
    )
) AS retreat_data (
    title, description, city, price, duration, start_date, end_date,
    type, amenities, images, rating, review_count
); 