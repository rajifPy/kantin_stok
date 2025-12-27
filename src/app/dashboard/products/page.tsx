'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Plus, Edit, Trash2, Search, Filter, Download, Package, Barcode, Eye } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showLowStock, setShowLowStock] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory, showLowStock]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const { data } = await res.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.nama_produk.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.barcode_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.kategori === selectedCategory);
    }

    // Low stock filter
    if (showLowStock) {
      filtered = filtered.filter(p => p.stok < 10);
    }

    setFilteredProducts(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;
    
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleViewBarcode = async (product: Product) => {
    setSelectedProduct(product);
    setShowBarcodeModal(true);
  };

  const handleDownloadBarcode = async (product: Product) => {
    try {
      const res = await fetch('/api/barcode/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          barcode_id: product.barcode_id,
          nama_produk: product.nama_produk 
        }),
      });
      const { barcode_url } = await res.json();
      
      // Download the barcode
      const link = document.createElement('a');
      link.href = barcode_url;
      link.download = `barcode_${product.barcode_id}.svg`;
      link.click();
    } catch (error) {
      console.error('Error downloading barcode:', error);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Barcode ID', 'Nama Produk', 'Kategori', 'Stok', 'Harga Modal', 'Harga Jual', 'Margin'];
    const rows = filteredProducts.map(p => [
      p.barcode_id,
      p.nama_produk,
      p.kategori,
      p.stok,
      p.harga_modal,
      p.harga_jual,
      `${(((p.harga_jual - p.harga_modal) / p.harga_jual) * 100).toFixed(1)}%`
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => 
        typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
      ).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `products_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const categories = ['all', ...Array.from(new Set(products.map(p => p.kategori)))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-700 font-semibold text-lg">Memuat produk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <Package className="text-white" size={24} />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Manajemen Produk
                </h1>
              </div>
              <p className="text-gray-600 ml-14">Kelola inventori dan stok barang</p>
            </div>
            <Link
              href="/dashboard/products/add"
              className="group relative overflow-hidden px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative flex items-center gap-2">
                <Plus size={20} />
                <span>Tambah Produk</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Package className="text-blue-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-blue-600">{products.length}</span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Total Produk</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <Package className="text-green-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-green-600">
                {products.reduce((sum, p) => sum + p.stok, 0)}
              </span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Total Stok</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Package className="text-orange-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-orange-600">
                {products.filter(p => p.stok < 10).length}
              </span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Stok Menipis</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Package className="text-purple-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-purple-600">
                {formatCurrency(products.reduce((sum, p) => sum + (p.stok * p.harga_jual), 0))}
              </span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Nilai Inventori</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Cari produk atau barcode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'Semua Kategori' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowLowStock(!showLowStock)}
                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                  showLowStock
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter size={18} className="inline mr-2" />
                {showLowStock ? 'Reset' : 'Low Stock'}
              </button>
              <button
                onClick={handleExportCSV}
                className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
              >
                <Download size={18} className="inline" />
              </button>
            </div>
          </div>

          {/* Results Info */}
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Menampilkan <strong>{filteredProducts.length}</strong> dari <strong>{products.length}</strong> produk
            </span>
            {(searchTerm || selectedCategory !== 'all' || showLowStock) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setShowLowStock(false);
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Barcode
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Nama Produk
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Stok
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Harga
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Margin
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewBarcode(product)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Lihat Barcode"
                        >
                          <Barcode size={16} className="text-gray-600" />
                        </button>
                        <span className="text-sm font-mono font-semibold text-gray-900">
                          {product.barcode_id}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{product.nama_produk}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {product.kategori}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                        product.stok === 0 
                          ? 'bg-red-100 text-red-800' 
                          : product.stok < 10 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {product.stok === 0 ? 'HABIS' : `${product.stok} unit`}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-semibold">
                        {formatCurrency(product.harga_jual)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Modal: {formatCurrency(product.harga_modal)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-green-600">
                        {(((product.harga_jual - product.harga_modal) / product.harga_jual) * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewBarcode(product)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Lihat Barcode"
                        >
                          <Eye size={18} />
                        </button>
                        <Link
                          href={`/dashboard/products/${product.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">Tidak ada produk ditemukan</p>
              <p className="text-gray-400 text-sm mt-2">
                {searchTerm || selectedCategory !== 'all' || showLowStock 
                  ? 'Coba ubah filter pencarian Anda' 
                  : 'Mulai dengan menambahkan produk baru'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Barcode Modal */}
      {showBarcodeModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Barcode Preview</h3>
                <button
                  onClick={() => setShowBarcodeModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">Produk:</p>
                <p className="text-lg font-bold text-gray-900">{selectedProduct.nama_produk}</p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 mb-6 flex items-center justify-center">
                <BarcodePreview product={selectedProduct} />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => handleDownloadBarcode(selectedProduct)}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                >
                  <Download size={18} className="inline mr-2" />
                  Download SVG
                </button>
                <button
                  onClick={() => setShowBarcodeModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-semibold transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Barcode Preview Component
function BarcodePreview({ product }: { product: Product }) {
  const [barcodeUrl, setBarcodeUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateBarcode();
  }, [product]);

  const generateBarcode = async () => {
    try {
      const res = await fetch('/api/barcode/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          barcode_id: product.barcode_id,
          nama_produk: product.nama_produk 
        }),
      });
      const { barcode_url } = await res.json();
      setBarcodeUrl(barcode_url);
      setLoading(false);
    } catch (error) {
      console.error('Error generating barcode:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="text-center">
      {barcodeUrl ? (
        <img src={barcodeUrl} alt={`Barcode ${product.barcode_id}`} className="max-w-full h-auto" />
      ) : (
        <p className="text-red-600">Gagal generate barcode</p>
      )}
    </div>
  );
}
