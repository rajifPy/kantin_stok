'use client';

import { useEffect, useState } from 'react';
import { Transaction, Product } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, TrendingUp, Package, DollarSign, ShoppingCart } from 'lucide-react';

export default function ReportsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    try {
      const [transRes, prodRes] = await Promise.all([
        fetch(`/api/transactions?startDate=${dateRange.start}&endDate=${dateRange.end}`),
        fetch('/api/products'),
      ]);

      const { data: trans } = await transRes.json();
      const { data: prods } = await prodRes.json();

      setTransactions(trans);
      setProducts(prods);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalRevenue = transactions.reduce((sum, t) => sum + t.total_harga, 0);
  const totalProfit = transactions.reduce((sum, t) => sum + t.keuntungan, 0);
  const totalTransactions = transactions.length;
  const avgTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  // Sales by day
  const salesByDay = transactions.reduce((acc: any, t) => {
    const date = formatDate(t.created_at);
    if (!acc[date]) {
      acc[date] = { date, revenue: 0, profit: 0, count: 0 };
    }
    acc[date].revenue += t.total_harga;
    acc[date].profit += t.keuntungan;
    acc[date].count += 1;
    return acc;
  }, {});

  const dailyData = Object.values(salesByDay).sort((a: any, b: any) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Top products
  const productSales = transactions.reduce((acc: any, t) => {
    if (!acc[t.barcode_id]) {
      acc[t.barcode_id] = {
        name: t.nama_produk,
        quantity: 0,
        revenue: 0,
      };
    }
    acc[t.barcode_id].quantity += t.jumlah;
    acc[t.barcode_id].revenue += t.total_harga;
    return acc;
  }, {});

  const topProducts = Object.values(productSales)
    .sort((a: any, b: any) => b.revenue - a.revenue)
    .slice(0, 10);

  // Sales by category
  const salesByCategory = transactions.reduce((acc: any, t) => {
    const product = products.find(p => p.barcode_id === t.barcode_id);
    const category = product?.kategori || 'Lainnya';
    
    if (!acc[category]) {
      acc[category] = { name: category, value: 0 };
    }
    acc[category].value += t.total_harga;
    return acc;
  }, {});

  const categoryData = Object.values(salesByCategory);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const handleExportReport = () => {
    const reportData = {
      period: `${dateRange.start} to ${dateRange.end}`,
      summary: {
        totalRevenue,
        totalProfit,
        totalTransactions,
        avgTransaction,
      },
      dailySales: dailyData,
      topProducts,
      categoryBreakdown: categoryData,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${dateRange.start}_${dateRange.end}.json`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Laporan & Analitik</h1>
              <p className="text-gray-600 mt-1">Analisis performa penjualan</p>
            </div>
            <button
              onClick={handleExportReport}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
            >
              <Download size={20} />
              Export Report
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Date Range Filter */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dari Tanggal
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sampai Tanggal
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pendapatan</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalRevenue)}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Keuntungan</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(totalProfit)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Transaksi</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{totalTransactions}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <ShoppingCart className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rata-rata Transaksi</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">{formatCurrency(avgTransaction)}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Package className="text-orange-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Revenue Chart */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Pendapatan Harian</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3B82F6" name="Pendapatan" strokeWidth={2} />
                <Line type="monotone" dataKey="profit" stroke="#10B981" name="Keuntungan" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Sales by Category */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Penjualan per Kategori</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.name}: ${formatCurrency(entry.value)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Top 10 Produk Terlaris</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip formatter={(value: any) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="revenue" fill="#3B82F6" name="Pendapatan" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold">Detail Produk Terlaris</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produk</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Terjual</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pendapatan</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topProducts.map((product: any, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-gray-900">#{index + 1}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{product.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{product.quantity} unit</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-green-600">{formatCurrency(product.revenue)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}