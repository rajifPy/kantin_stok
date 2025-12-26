'use client';

import { useEffect, useState } from 'react';
import { Product, Transaction } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    todayTransactions: 0,
    todayRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch products
      const productsRes = await fetch('/api/products');
      const { data: products } = await productsRes.json();

      // Fetch transactions
      const transRes = await fetch('/api/transactions?limit=100');
      const { data: transactions } = await transRes.json();

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const todayTrans = transactions.filter((t: Transaction) => 
        t.created_at.startsWith(today)
      );

      setStats({
        totalProducts: products.length,
        totalStock: products.reduce((sum: number, p: Product) => sum + p.stok, 0),
        todayTransactions: todayTrans.length,
        todayRevenue: todayTrans.reduce((sum: number, t: Transaction) => sum + t.total_harga, 0),
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Total Produk</p>
          <p className="text-3xl font-bold text-blue-600">{stats.totalProducts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Total Stok</p>
          <p className="text-3xl font-bold text-green-600">{stats.totalStock}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Transaksi Hari Ini</p>
          <p className="text-3xl font-bold text-purple-600">{stats.todayTransactions}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Pendapatan Hari Ini</p>
          <p className="text-3xl font-bold text-orange-600">{formatCurrency(stats.todayRevenue)}</p>
        </div>
      </div>

      {/* Charts akan ditambahkan di sini */}
    </div>
  );
}