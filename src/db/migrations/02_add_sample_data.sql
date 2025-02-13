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