import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Product {
  id: string;
  barcode_id: string;
  nama_produk: string;
  kategori: string;
  stok: number;
  harga_modal: number;
  harga_jual: number;
  barcode_image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  transaksi_id: string;
  product_id: string | null;
  barcode_id: string;
  nama_produk: string;
  jumlah: number;
  harga_satuan: number;
  total_harga: number;
  keuntungan: number;
  created_at: string;
}

export interface CreateProductInput {
  barcode_id: string;
  nama_produk: string;
  kategori: string;
  stok: number;
  harga_modal: number;
  harga_jual: number;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: string;
}

export interface CreateTransactionInput {
  barcode_id: string;
  nama_produk: string;
  jumlah: number;
  harga_satuan: number;
  harga_modal: number;
}