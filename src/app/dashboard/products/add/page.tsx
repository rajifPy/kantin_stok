'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateBarcodeId } from '@/lib/utils';
import { ArrowLeft, Plus, Barcode } from 'lucide-react';
import Link from 'next/link';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    barcode_id: generateBarcodeId(),
    nama_produk: '',
    kategori: 'Makanan',
    stok: 0,
    harga_modal: 0,
    harga_jual: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validation
      if (formData.harga_jual <= formData.harga_modal) {
        setError('Harga jual harus lebih besar dari harga modal');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/dashboard/products');
      } else {
        setError(data.error || 'Gagal menambahkan produk');
      }
    } catch (error) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const generateNewBarcode = () => {
    setFormData({ ...formData, barcode_id: generateBarcodeId() });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/products"
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tambah Produk Baru</h1>
              <p className="text-gray-600 mt-1">Tambahkan produk ke database</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 max-w-2xl mx-auto">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Barcode ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Barcode ID *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.barcode_id}
                  onChange={(e) => setFormData({ ...formData, barcode_id: e.target.value.toUpperCase() })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  placeholder="BRK0001"
                  required
                  pattern="[A-Z0-9]{3,50}"
                  title="Alphanumeric, uppercase, 3-50 karakter"
                />
                <button
                  type="button"
                  onClick={generateNewBarcode}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2"
                >
                  <Barcode size={20} />
                  Generate
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Format: Huruf kapital dan angka, tanpa spasi (contoh: BRK0001)
              </p>
            </div>

            {/* Nama Produk */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Produk *
              </label>
              <input
                type="text"
                value={formData.nama_produk}
                onChange={(e) => setFormData({ ...formData, nama_produk: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contoh: Aqua 600ml"
                required
                maxLength={200}
              />
            </div>

            {/* Kategori */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori *
              </label>
              <select
                value={formData.kategori}
                onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="Makanan">Makanan</option>
                <option value="Minuman">Minuman</option>
                <option value="Snack">Snack</option>
                <option value="Alat Tulis">Alat Tulis</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            {/* Stok */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stok Awal *
              </label>
              <input
                type="number"
                value={formData.stok}
                onChange={(e) => setFormData({ ...formData, stok: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                required
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                Jumlah produk yang tersedia
              </p>
            </div>

            {/* Harga Modal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Harga Modal (Rp) *
              </label>
              <input
                type="number"
                value={formData.harga_modal}
                onChange={(e) => setFormData({ ...formData, harga_modal: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                required
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                Harga beli/modal produk
              </p>
            </div>

            {/* Harga Jual */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Harga Jual (Rp) *
              </label>
              <input
                type="number"
                value={formData.harga_jual}
                onChange={(e) => setFormData({ ...formData, harga_jual: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                required
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                Harga jual ke konsumen (harus lebih besar dari harga modal)
              </p>
            </div>

            {/* Profit Info */}
            {formData.harga_jual > 0 && formData.harga_modal > 0 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Keuntungan per unit:</strong> Rp {(formData.harga_jual - formData.harga_modal).toLocaleString('id-ID')}
                  {' '}
                  ({(((formData.harga_jual - formData.harga_modal) / formData.harga_jual) * 100).toFixed(1)}% margin)
                </p>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <Link
                href="/dashboard/products"
                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition text-center"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="spinner border-white"></div>
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    <span>Simpan Produk</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
