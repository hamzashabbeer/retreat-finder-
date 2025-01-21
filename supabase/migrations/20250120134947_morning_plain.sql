/*
  # Create retreats table and related schemas

  1. New Tables
    - `retreats`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `location` (jsonb)
      - `price` (jsonb)
      - `duration` (integer)
      - `startDate` (date)
      - `endDate` (date)
      - `type` (text[])
      - `amenities` (text[])
      - `images` (text[])
      - `hostId` (uuid, references auth.users)
      - `rating` (numeric)
      - `reviewCount` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `retreats` table
    - Add policies for public read access
    - Add policies for host write access
*/

CREATE TABLE retreats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  location jsonb NOT NULL,
  price jsonb NOT NULL,
  duration integer NOT NULL,
  startDate date NOT NULL,
  endDate date NOT NULL,
  type text[] NOT NULL,
  amenities text[] NOT NULL,
  images text[] NOT NULL,
  hostId uuid REFERENCES auth.users NOT NULL,
  rating numeric DEFAULT 0,
  reviewCount integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE retreats ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Retreats are viewable by everyone"
  ON retreats
  FOR SELECT
  USING (true);

-- Allow hosts to manage their own retreats
CREATE POLICY "Hosts can insert their own retreats"
  ON retreats
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = hostId);

CREATE POLICY "Hosts can update their own retreats"
  ON retreats
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = hostId)
  WITH CHECK (auth.uid() = hostId);

CREATE POLICY "Hosts can delete their own retreats"
  ON retreats
  FOR DELETE
  TO authenticated
  USING (auth.uid() = hostId);