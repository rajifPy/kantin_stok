// src/app/(dashboard)/products/add/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateBarcodeId } from '@/lib/utils';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
    setLoading(true);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/dashboard/products');
      } else {
        const error = await res.json();
        alert(error.error);
      }
    } catch (error) {
      alert('Gagal menambahkan produk');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Tambah Produk Baru</h1>
      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Barcode ID</label>
            <input
              type="text"
              value={formData.barcode_id}
              onChange={(e) => setFormData({ ...formData, barcode_id: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Nama Produk</label>
            <input
              type="text"
              value={formData.nama_produk}
              onChange={(e) => setFormData({ ...formData, nama_produk: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Kategori</label>
            <select
              value={formData.kategori}
              onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="Makanan">Makanan</option>
              <option value="Minuman">Minuman</option>
              <option value="Snack">Snack</option>
              <option value="Alat Tulis">Alat Tulis</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Stok</label>
            <input
              type="number"
              value={formData.stok}
              onChange={(e) => setFormData({ ...formData, stok: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Harga Modal</label>
            <input
              type="number"
              value={formData.harga_modal}
              onChange={(e) => setFormData({ ...formData, harga_modal: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Harga Jual</label>
            <input
              type="number"
              value={formData.harga_jual}
              onChange={(e) => setFormData({ ...formData, harga_jual: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Simpan Produk'}
          </button>
        </form>
      </div>
    </div>
  );
}
