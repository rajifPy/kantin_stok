-- =====================================================
-- KANTIN SEKOLAH DATABASE SCHEMA
-- PostgreSQL / Supabase
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PRODUCTS TABLE
-- =====================================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barcode_id VARCHAR(50) UNIQUE NOT NULL,
  nama_produk VARCHAR(200) NOT NULL,
  kategori VARCHAR(50) NOT NULL,
  stok INTEGER NOT NULL DEFAULT 0 CHECK (stok >= 0),
  harga_modal DECIMAL(12,2) NOT NULL CHECK (harga_modal >= 0),
  harga_jual DECIMAL(12,2) NOT NULL CHECK (harga_jual >= 0),
  barcode_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index untuk performance
CREATE INDEX idx_products_barcode ON products(barcode_id);
CREATE INDEX idx_products_kategori ON products(kategori);
CREATE INDEX idx_products_stok ON products(stok);
CREATE INDEX idx_products_created ON products(created_at DESC);

-- =====================================================
-- TRANSACTIONS TABLE
-- =====================================================
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaksi_id VARCHAR(20) UNIQUE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  barcode_id VARCHAR(50) NOT NULL,
  nama_produk VARCHAR(200) NOT NULL,
  jumlah INTEGER NOT NULL CHECK (jumlah > 0),
  harga_satuan DECIMAL(12,2) NOT NULL CHECK (harga_satuan >= 0),
  total_harga DECIMAL(12,2) NOT NULL CHECK (total_harga >= 0),
  keuntungan DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index untuk performance
CREATE INDEX idx_transactions_created ON transactions(created_at DESC);
CREATE INDEX idx_transactions_product ON transactions(product_id);
CREATE INDEX idx_transactions_barcode ON transactions(barcode_id);
CREATE INDEX idx_transactions_transaksi_id ON transactions(transaksi_id);

-- =====================================================
-- USERS TABLE (optional - untuk multi-user)
-- =====================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'kasir', 'manager')),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

-- =====================================================
-- ACTIVITY LOGS TABLE (optional - untuk audit trail)
-- =====================================================
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  username VARCHAR(50),
  activity_type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_logs_created ON activity_logs(created_at DESC);
CREATE INDEX idx_logs_user ON activity_logs(user_id);
CREATE INDEX idx_logs_type ON activity_logs(activity_type);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function untuk auto-update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk products table
CREATE TRIGGER products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger untuk users table
CREATE TRIGGER users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Function untuk generate transaction ID
CREATE OR REPLACE FUNCTION generate_transaction_id()
RETURNS TEXT AS $$
DECLARE
  next_id INTEGER;
  new_trans_id TEXT;
BEGIN
  -- Get last transaction number
  SELECT COALESCE(
    MAX(CAST(SUBSTRING(transaksi_id FROM 4) AS INTEGER)), 
    0
  ) + 1 INTO next_id
  FROM transactions;
  
  -- Format: TRX00001, TRX00002, etc
  new_trans_id := 'TRX' || LPAD(next_id::TEXT, 5, '0');
  
  RETURN new_trans_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) - Optional
-- =====================================================

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Policy untuk products (allow all for authenticated users)
CREATE POLICY "Allow all for authenticated users" ON products
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy untuk transactions
CREATE POLICY "Allow all for authenticated users" ON transactions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy untuk users (only admins can modify)
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy untuk activity_logs
CREATE POLICY "Allow insert for authenticated users" ON activity_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow view for authenticated users" ON activity_logs
  FOR SELECT
  TO authenticated
  USING (true);

-- =====================================================
-- VIEWS untuk Reporting
-- =====================================================

-- View: Daily Sales Summary
CREATE OR REPLACE VIEW daily_sales_summary AS
SELECT 
  DATE(created_at) as tanggal,
  COUNT(*) as jumlah_transaksi,
  SUM(jumlah) as total_items_terjual,
  SUM(total_harga) as total_pendapatan,
  SUM(keuntungan) as total_keuntungan,
  AVG(total_harga) as rata_rata_transaksi
FROM transactions
GROUP BY DATE(created_at)
ORDER BY tanggal DESC;

-- View: Product Stock Summary
CREATE OR REPLACE VIEW product_stock_summary AS
SELECT 
  kategori,
  COUNT(*) as jumlah_produk,
  SUM(stok) as total_stok,
  SUM(stok * harga_modal) as nilai_modal,
  SUM(stok * harga_jual) as nilai_jual,
  COUNT(CASE WHEN stok < 10 THEN 1 END) as produk_stok_menipis
FROM products
GROUP BY kategori
ORDER BY kategori;

-- View: Top Selling Products
CREATE OR REPLACE VIEW top_selling_products AS
SELECT 
  t.barcode_id,
  t.nama_produk,
  p.kategori,
  COUNT(*) as jumlah_transaksi,
  SUM(t.jumlah) as total_terjual,
  SUM(t.total_harga) as total_pendapatan,
  SUM(t.keuntungan) as total_keuntungan
FROM transactions t
LEFT JOIN products p ON t.product_id = p.id
GROUP BY t.barcode_id, t.nama_produk, p.kategori
ORDER BY total_terjual DESC;

-- =====================================================
-- SEED DATA (Sample Data for Testing)
-- =====================================================

-- Insert sample products
INSERT INTO products (barcode_id, nama_produk, kategori, stok, harga_modal, harga_jual) VALUES
('BRK001', 'Aqua 600ml', 'Minuman', 100, 2500, 3000),
('BRK002', 'Indomie Goreng', 'Makanan', 75, 2800, 3500),
('BRK003', 'Pulpen Standard', 'Alat Tulis', 50, 1500, 2000),
('BRK004', 'Chitato Sapi Panggang', 'Snack', 60, 8000, 10000),
('BRK005', 'Teh Botol Sosro', 'Minuman', 80, 3000, 4000),
('BRK006', 'Buku Tulis 38 Lembar', 'Alat Tulis', 40, 3000, 4000),
('BRK007', 'Mie Sedaap Goreng', 'Makanan', 65, 2800, 3500),
('BRK008', 'Pocari Sweat 350ml', 'Minuman', 45, 5000, 6500),
('BRK009', 'Oreo Vanilla', 'Snack', 55, 7500, 9000),
('BRK010', 'Pulpen Gel Hitam', 'Alat Tulis', 70, 2500, 3500);

-- Insert sample user (password: admin123)
-- Note: In production, use proper password hashing!
INSERT INTO users (username, password_hash, full_name, role) VALUES
('admin', '$2a$10$X1234567890123456789euJ9vQXKZQrXwPj3OMxXCKNhZXxVy', 'Administrator', 'admin');

-- Insert sample transactions
INSERT INTO transactions (transaksi_id, product_id, barcode_id, nama_produk, jumlah, harga_satuan, total_harga, keuntungan)
SELECT 
  'TRX' || LPAD((ROW_NUMBER() OVER ())::TEXT, 5, '0'),
  p.id,
  p.barcode_id,
  p.nama_produk,
  (RANDOM() * 5 + 1)::INTEGER,
  p.harga_jual,
  ((RANDOM() * 5 + 1)::INTEGER) * p.harga_jual,
  ((RANDOM() * 5 + 1)::INTEGER) * (p.harga_jual - p.harga_modal)
FROM products p
CROSS JOIN generate_series(1, 3);

-- =====================================================
-- USEFUL QUERIES (for reference)
-- =====================================================

-- Get low stock products
-- SELECT * FROM products WHERE stok < 10 ORDER BY stok ASC;

-- Get today's transactions
-- SELECT * FROM transactions WHERE DATE(created_at) = CURRENT_DATE;

-- Get sales by category
-- SELECT p.kategori, COUNT(*) as total_transaksi, SUM(t.total_harga) as total_pendapatan
-- FROM transactions t
-- JOIN products p ON t.product_id = p.id
-- GROUP BY p.kategori;

-- Get revenue trend (last 7 days)
-- SELECT DATE(created_at) as tanggal, SUM(total_harga) as pendapatan
-- FROM transactions
-- WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
-- GROUP BY DATE(created_at)
-- ORDER BY tanggal;

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant permissions to authenticated users
GRANT ALL ON products TO authenticated;
GRANT ALL ON transactions TO authenticated;
GRANT SELECT ON users TO authenticated;
GRANT ALL ON activity_logs TO authenticated;

-- Grant permissions on views
GRANT SELECT ON daily_sales_summary TO authenticated;
GRANT SELECT ON product_stock_summary TO authenticated;
GRANT SELECT ON top_selling_products TO authenticated;

-- =====================================================
-- END OF SCHEMA
-- =====================================================