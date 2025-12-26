'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${params.id}`);
      const { data } = await res.json();
      
      if (data) {
        setFormData(data);
      } else {
        setError('Produk tidak ditemukan');
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError('Gagal memuat data produk');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      // Validation
      if (formData.harga_jual <= formData.harga_modal) {
        setError('Harga jual harus lebih besar dari harga modal');
        setSaving(false);
        return;
      }

      const res = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/dashboard/products');
      } else {
        setError(data.error || 'Gagal mengupdate produk');
      }
    } catch (error) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Yakin ingin menghapus produk ini? Aksi ini tidak dapat dibatalkan.')) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${params.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.push('/dashboard/products');
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal menghapus produk');
      }
    } catch (error) {
      alert('Terjadi kesalahan saat menghapus');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner border-blue-600"></div>
      </div>
    );
  }

  if (error && !formData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            {error}
          </div>
          <Link
            href="/dashboard/products"
            className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft size={20} />
            Kembali ke Daftar Produk
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/products"
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={24} />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Produk</h1>
                <p className="text-gray-600 mt-1">{formData?.nama_produk}</p>
              </div>
            </div>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2"
            >
              <Trash2 size={18} />
              Hapus
            </button>
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
            {/* Barcode ID (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Barcode ID
              </label>
              <input
                type="text"
                value={formData?.barcode_id || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">
                Barcode ID tidak dapat diubah
              </p>
            </div>

            {/* Nama Produk */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Produk *
              </label>
              <input
                type="text"
                value={formData?.nama_produk || ''}
                onChange={(e) => setFormData({ ...formData, nama_produk: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                value={formData?.kategori || ''}
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
                Stok *
              </label>
              <input
                type="number"
                value={formData?.stok || 0}
                onChange={(e) => setFormData({ ...formData, stok: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                min="0"
              />
            </div>

            {/* Harga Modal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Harga Modal (Rp) *
              </label>
              <input
                type="number"
                value={formData?.harga_modal || 0}
                onChange={(e) => setFormData({ ...formData, harga_modal: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                min="0"
              />
            </div>

            {/* Harga Jual */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Harga Jual (Rp) *
              </label>
              <input
                type="number"
                value={formData?.harga_jual || 0}
                onChange={(e) => setFormData({ ...formData, harga_jual: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                min="0"
              />
            </div>

            {/* Profit Info */}
            {formData && formData.harga_jual > 0 && formData.harga_modal > 0 && (
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
                disabled={saving}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="spinner border-white"></div>
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>Simpan Perubahan</span>
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
