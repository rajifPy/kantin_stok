'use client';

import { useEffect, useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { Package, TrendingUp, ShoppingCart, DollarSign, AlertTriangle, ArrowRight, Activity, Users, Clock, Star } from 'lucide-react';
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
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const productsRes = await fetch('/api/products');
      const { data: products } = await productsRes.json();

      const transRes = await fetch('/api/transactions?limit=100');
      const { data: transactions } = await transRes.json();

      const today = new Date().toISOString().split('T')[0];
      const todayTrans = transactions.filter((t: any) =>
        t.created_at.startsWith(today)
      );

      const lowStock = products.filter((p: any) => p.stok < 10);

      setStats({
        totalProducts: products.length,
        totalStock: products.reduce((sum: number, p: any) => sum + p.stok, 0),
        lowStockCount: lowStock.length,
        todayTransactions: todayTrans.length,
        todayRevenue: todayTrans.reduce((sum: number, t: any) => sum + t.total_harga, 0),
        todayProfit: todayTrans.reduce((sum: number, t: any) => sum + t.keuntungan, 0),
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-700 font-semibold text-lg">Memuat data...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Produk",
      value: stats.totalProducts,
      icon: Package,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      trend: "+12%",
      trendUp: true
    },
    {
      title: "Total Stok",
      value: stats.totalStock,
      icon: TrendingUp,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      trend: "+8%",
      trendUp: true
    },
    {
      title: "Transaksi Hari Ini",
      value: stats.todayTransactions,
      icon: ShoppingCart,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      trend: "+15%",
      trendUp: true
    },
    {
      title: "Pendapatan Hari Ini",
      value: formatCurrency(stats.todayRevenue),
      icon: DollarSign,
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      trend: "+23%",
      trendUp: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <Activity className="text-white" size={24} />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Dashboard
                </h1>
              </div>
              <p className="text-gray-600 ml-14">Selamat datang kembali! Berikut ringkasan hari ini.</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <Clock size={16} />
                <span>Last updated: just now</span>
              </div>
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
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-50`}></div>
              
              {/* Card Content */}
              <div className="relative bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${card.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                    <card.icon className={card.iconColor} size={24} />
                  </div>
                  {card.trend && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                      card.trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      <TrendingUp size={12} className={card.trendUp ? '' : 'rotate-180'} />
                      {card.trend}
                    </div>
                  )}
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                  <p className={`text-3xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                    {card.value}
                  </p>
                </div>

                {/* Animated Border */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Cards Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Profit Card */}
          <div className="relative overflow-hidden rounded-2xl shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"></div>
            <div className="absolute inset-0 bg-black/20"></div>
            
            {/* Animated Particles */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>

            <div className="relative p-8 text-white">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Star className="fill-current" size={20} />
                  Keuntungan Hari Ini
                </h3>
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <TrendingUp size={28} />
                </div>
              </div>
              <p className="text-5xl font-bold mb-3">{formatCurrency(stats.todayProfit)}</p>
              <p className="text-blue-100 text-sm flex items-center gap-2">
                <Activity size={16} />
                Dari {stats.todayTransactions} transaksi hari ini
              </p>
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="relative overflow-hidden rounded-2xl shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600"></div>
            <div className="absolute inset-0 bg-black/20"></div>
            
            {/* Animated Warning */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            </div>

            <div className="relative p-8 text-white">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <AlertTriangle className="animate-pulse" size={20} />
                  Produk Stok Menipis
                </h3>
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Package size={28} />
                </div>
              </div>
              <p className="text-5xl font-bold mb-3">{stats.lowStockCount}</p>
              <Link 
                href="/dashboard/products?lowStock=true"
                className="text-orange-100 hover:text-white inline-flex items-center gap-2 font-medium transition-all group"
              >
                Lihat detail 
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <ShoppingCart size={20} className="text-blue-600" />
                  Transaksi Terbaru
                </h3>
                <Link 
                  href="/dashboard/transactions"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1 group"
                >
                  Lihat semua 
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            <div className="p-6">
              {recentTransactions.length > 0 ? (
                <div className="space-y-4">
                  {recentTransactions.map((transaction: any, index) => (
                    <div
                      key={transaction.id}
                      className="group flex items-center justify-between p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl hover:from-blue-100 hover:to-purple-100 transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:shadow-md"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {transaction.nama_produk}
                          </p>
                          <p className="text-sm text-gray-500">
                            {transaction.jumlah} × {formatCurrency(transaction.harga_satuan)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          {formatCurrency(transaction.total_harga)}
                        </p>
                        <p className="text-xs text-green-600 font-semibold">
                          +{formatCurrency(transaction.keuntungan)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Belum ada transaksi hari ini</p>
                </div>
              )}
            </div>
          </div>

          {/* Low Stock Products */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <AlertTriangle size={20} className="text-orange-600" />
                  Produk Perlu Restock
                </h3>
                <Link 
                  href="/dashboard/products"
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium inline-flex items-center gap-1 group"
                >
                  Kelola produk 
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            <div className="p-6">
              {lowStockProducts.length > 0 ? (
                <div className="space-y-4">
                  {lowStockProducts.map((product: any) => (
                    <div
                      key={product.id}
                      className="group flex items-center justify-between p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Package size={20} className="text-white" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                            <AlertTriangle size={12} className="text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                            {product.nama_produk}
                          </p>
                          <p className="text-sm text-gray-500">{product.kategori}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold ${
                          product.stok === 0 
                            ? 'bg-red-100 text-red-800 border border-red-200' 
                            : 'bg-orange-100 text-orange-800 border border-orange-200'
                        }`}>
                          {product.stok === 0 ? 'HABIS' : `${product.stok} unit`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Semua produk stok aman</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
