-- ========================================================
-- Siva Electronics Supabase PostgreSQL Schema
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. BRANDS TABLE
CREATE TABLE IF NOT EXISTS brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    description TEXT NOT NULL,
    specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_available BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. PRODUCT IMAGES TABLE
CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. SPARE PARTS TABLE
CREATE TABLE IF NOT EXISTS spare_parts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    compatible_models TEXT[] NOT NULL DEFAULT '{}',
    brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
    price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    stock_qty INTEGER NOT NULL DEFAULT 0,
    is_available BOOLEAN NOT NULL DEFAULT true,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. GALLERY TABLE
CREATE TABLE IF NOT EXISTS gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Shop', 'Products', 'Repair', 'Installation', 'Spare Parts')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. INVENTORY TABLE
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_type TEXT NOT NULL CHECK (item_type IN ('product', 'spare_part')),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    spare_part_id UUID REFERENCES spare_parts(id) ON DELETE CASCADE,
    stock_qty INTEGER NOT NULL DEFAULT 0,
    low_stock_threshold INTEGER NOT NULL DEFAULT 5,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT check_only_one_item_type CHECK (
        (item_type = 'product' AND product_id IS NOT NULL AND spare_part_id IS NULL) OR
        (item_type = 'spare_part' AND spare_part_id IS NOT NULL AND product_id IS NULL)
    ),
    CONSTRAINT unique_product_inventory UNIQUE (product_id),
    CONSTRAINT unique_spare_part_inventory UNIQUE (spare_part_id)
);

-- 8. INVENTORY HISTORY TABLE
CREATE TABLE IF NOT EXISTS inventory_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inventory_id UUID REFERENCES inventory(id) ON DELETE CASCADE NOT NULL,
    quantity_change INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('increase', 'decrease', 'set', 'initial')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name TEXT NOT NULL DEFAULT 'Siva Electronics',
    logo_url TEXT,
    phone TEXT NOT NULL DEFAULT '',
    whatsapp TEXT NOT NULL DEFAULT '',
    address TEXT NOT NULL DEFAULT '',
    business_hours JSONB NOT NULL DEFAULT '{"weekdays": "9:00 AM - 8:30 PM", "sunday": "10:00 AM - 5:00 PM"}'::jsonb,
    social_links JSONB NOT NULL DEFAULT '{"facebook": "", "instagram": "", "youtube": ""}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 10. ADMINS TABLE
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY, -- References auth.users.id
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ========================================================
-- INDEXES FOR PERFORMANCE
-- ========================================================
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_spare_parts_brand ON spare_parts(brand_id);
CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_spare_part ON inventory(spare_part_id);
CREATE INDEX IF NOT EXISTS idx_inventory_history_inventory ON inventory_history(inventory_id);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE spare_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Helper function to check if the current user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admins WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policies for Categories
DROP POLICY IF EXISTS "Public Read Categories" ON categories;
DROP POLICY IF EXISTS "Admin Write Categories" ON categories;
CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admin Write Categories" ON categories FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Policies for Brands
DROP POLICY IF EXISTS "Public Read Brands" ON brands;
DROP POLICY IF EXISTS "Admin Write Brands" ON brands;
CREATE POLICY "Public Read Brands" ON brands FOR SELECT USING (true);
CREATE POLICY "Admin Write Brands" ON brands FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Policies for Products
DROP POLICY IF EXISTS "Public Read Products" ON products;
DROP POLICY IF EXISTS "Admin Write Products" ON products;
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);
CREATE POLICY "Admin Write Products" ON products FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Policies for Product Images
DROP POLICY IF EXISTS "Public Read Product Images" ON product_images;
DROP POLICY IF EXISTS "Admin Write Product Images" ON product_images;
CREATE POLICY "Public Read Product Images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Admin Write Product Images" ON product_images FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Policies for Spare Parts
DROP POLICY IF EXISTS "Public Read Spare Parts" ON spare_parts;
DROP POLICY IF EXISTS "Admin Write Spare Parts" ON spare_parts;
CREATE POLICY "Public Read Spare Parts" ON spare_parts FOR SELECT USING (true);
CREATE POLICY "Admin Write Spare Parts" ON spare_parts FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Policies for Gallery
DROP POLICY IF EXISTS "Public Read Gallery" ON gallery;
DROP POLICY IF EXISTS "Admin Write Gallery" ON gallery;
CREATE POLICY "Public Read Gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Admin Write Gallery" ON gallery FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Policies for Inventory
DROP POLICY IF EXISTS "Public Read Inventory" ON inventory;
DROP POLICY IF EXISTS "Admin Write Inventory" ON inventory;
CREATE POLICY "Public Read Inventory" ON inventory FOR SELECT USING (true);
CREATE POLICY "Admin Write Inventory" ON inventory FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Policies for Inventory History
DROP POLICY IF EXISTS "Public Read Inventory History" ON inventory_history;
DROP POLICY IF EXISTS "Admin Write Inventory History" ON inventory_history;
CREATE POLICY "Public Read Inventory History" ON inventory_history FOR SELECT USING (true);
CREATE POLICY "Admin Write Inventory History" ON inventory_history FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Policies for Settings
DROP POLICY IF EXISTS "Public Read Settings" ON settings;
DROP POLICY IF EXISTS "Admin Write Settings" ON settings;
CREATE POLICY "Public Read Settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Admin Write Settings" ON settings FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Policies for Admins
DROP POLICY IF EXISTS "Admin Read Admins" ON admins;
DROP POLICY IF EXISTS "Admin Write Admins" ON admins;
CREATE POLICY "Admin Read Admins" ON admins FOR SELECT TO authenticated USING (is_admin());
CREATE POLICY "Admin Write Admins" ON admins FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- ========================================================
-- INITIAL SEED DATA
-- ========================================================

-- Seed Categories
INSERT INTO categories (name, slug) VALUES
('Smart TV', 'smart-tv'),
('LED TV', 'led-tv'),
('Custom Assembled TV', 'custom-assembled-tv'),
('Accessories', 'accessories')
ON CONFLICT (name) DO NOTHING;

-- Seed Brands
INSERT INTO brands (name) VALUES
('Samsung'),
('LG'),
('Sony'),
('MI'),
('OnePlus'),
('TCL'),
('Panasonic'),
('Vu'),
('Haier'),
('Hisense'),
('Motorola'),
('Realme'),
('Siva Electronics')
ON CONFLICT (name) DO NOTHING;

-- Seed Settings (exactly one row)
INSERT INTO settings (business_name, phone, whatsapp, address, business_hours, social_links)
VALUES (
    'Siva Electronics',
    '+919876543210',
    '+919876543210',
    '123, Main Bazaar Street, Near Post Office, Townville, Tamil Nadu, 600001',
    '{"weekdays": "9:00 AM - 8:30 PM", "sunday": "10:00 AM - 5:00 PM"}'::jsonb,
    '{"facebook": "https://facebook.com/sivaelectronics", "instagram": "https://instagram.com/sivaelectronics", "youtube": "https://youtube.com/sivaelectronics"}'::jsonb
) ON CONFLICT DO NOTHING;
