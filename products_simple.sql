-- Run this SQL in your Supabase SQL Editor to create the simple products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL DEFAULT 0.00,
    category TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable public select access for this table under Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON products 
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON products 
    FOR INSERT WITH CHECK (true);
