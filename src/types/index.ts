export interface Product {
  id: string;
  barcode_id: string;
  nama_produk: string;
  kategori: 'Makanan' | 'Minuman' | 'Snack' | 'Alat Tulis' | 'Lainnya';
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

export interface DashboardStats {
  totalProducts: number;
  totalStock: number;
  todayTransactions: number;
  todayRevenue: number;
  todayProfit: number;
  lowStockCount: number;
}