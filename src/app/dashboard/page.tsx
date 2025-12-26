'use client';

import { useEffect, useState } from 'react';
import { Product, Transaction } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { StatsCard } from '@/components/ui/StatsCard';
import { Card, CardBody } from '@/components/ui/Card';
import { Package, TrendingUp, ShoppingCart, DollarSign, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    lowStockCount: 0,
    todayTransactions: 0,
    todayRevenue: 0,
    todayProfit: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
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

      const lowStock = products.filter((p: Product) => p.stok < 10);

      setStats({
        totalProducts: products.length,
        totalStock: products.reduce((sum: number, p: Product) => sum + p.stok, 0),
        lowStockCount: lowStock.length,
        todayTransactions: todayTrans.length,
        todayRevenue: todayTrans.reduce((sum: number, t: Transaction) => sum + t.total_harga, 0),
        todayProfit: todayTrans.reduce((sum: number, t: Transaction) => sum + t.keuntungan, 0),
      });

      setRecentTransactions(transactions.slice(0, 5));
      setLowStockProducts(lowStock.slice(0, 5));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Selamat datang kembali! Berikut ringkasan hari ini.</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Hari ini</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date().toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Produk"
            value={stats.totalProducts}
            icon={Package}
            color="blue"
          />
          <StatsCard
            title="Total Stok"
            value={stats.totalStock}
            icon={TrendingUp}
            color="green"
          />
          <StatsCard
            title="Transaksi Hari Ini"
            value={stats.todayTransactions}
            icon={ShoppingCart}
            color="purple"
          />
          <StatsCard
            title="Pendapatan Hari Ini"
            value={formatCurrency(stats.todayRevenue)}
            icon={DollarSign}
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Quick Stats */}
          <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0 shadow-xl">
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Keuntungan Hari Ini</h3>
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <TrendingUp size={24} />
                </div>
              </div>
              <p className="text-4xl font-bold mb-2">{formatCurrency(stats.todayProfit)}</p>
              <p className="text-blue-100 text-sm">
                Dari {stats.todayTransactions} transaksi hari ini
              </p>
            </CardBody>
          </Card>

          {/* Low Stock Alert */}
          <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-xl">
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Produk Stok Menipis</h3>
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <AlertTriangle size={24} />
                </div>
              </div>
              <p className="text-4xl font-bold mb-2">{stats.lowStockCount}</p>
              <Link 
                href="/dashboard/products?lowStock=true"
                className="text-orange-100 text-sm hover:text-white inline-flex items-center gap-1 transition-colors"
              >
                Lihat detail <ArrowRight size={16} />
              </Link>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Transaksi Terbaru</h3>
                <Link 
                  href="/dashboard/transactions"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
                >
                  Lihat semua <ArrowRight size={16} />
                </Link>
              </div>
              
              {recentTransactions.length > 0 ? (
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{transaction.nama_produk}</p>
                        <p className="text-sm text-gray-500">
                          {transaction.jumlah} × {formatCurrency(transaction.harga_satuan)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(transaction.total_harga)}
                        </p>
                        <p className="text-xs text-green-600">
                          +{formatCurrency(transaction.keuntungan)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Belum ada transaksi hari ini</p>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Low Stock Products */}
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Produk Perlu Restock</h3>
                <Link 
                  href="/dashboard/products"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
                >
                  Kelola produk <ArrowRight size={16} />
                </Link>
              </div>
              
              {lowStockProducts.length > 0 ? (
                <div className="space-y-4">
                  {lowStockProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-100"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{product.nama_produk}</p>
                        <p className="text-sm text-gray-500">{product.kategori}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                          {product.stok === 0 ? 'Habis' : `${product.stok} unit`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Semua produk stok aman</p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
