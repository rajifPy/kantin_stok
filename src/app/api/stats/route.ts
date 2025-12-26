import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * GET /api/stats
 * Get dashboard statistics
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || 'today'; // today, week, month, year

    // Get date range based on period
    const dateRange = getDateRange(period);

    // Fetch products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*');

    if (productsError) {
      throw new Error('Failed to fetch products');
    }

    // Fetch transactions for the period
    const { data: transactions, error: transError } = await supabase
      .from('transactions')
      .select('*')
      .gte('created_at', dateRange.start.toISOString())
      .lte('created_at', dateRange.end.toISOString());

    if (transError) {
      throw new Error('Failed to fetch transactions');
    }

    // Calculate statistics
    const stats = {
      // Product stats
      products: {
        total: products?.length || 0,
        totalStock: products?.reduce((sum, p) => sum + p.stok, 0) || 0,
        lowStock: products?.filter(p => p.stok < 10).length || 0,
        outOfStock: products?.filter(p => p.stok === 0).length || 0,
        totalValue: products?.reduce((sum, p) => sum + (p.stok * p.harga_jual), 0) || 0,
      },

      // Transaction stats
      transactions: {
        total: transactions?.length || 0,
        totalRevenue: transactions?.reduce((sum, t) => sum + t.total_harga, 0) || 0,
        totalProfit: transactions?.reduce((sum, t) => sum + t.keuntungan, 0) || 0,
        totalItems: transactions?.reduce((sum, t) => sum + t.jumlah, 0) || 0,
        avgTransaction: transactions?.length > 0
          ? transactions.reduce((sum, t) => sum + t.total_harga, 0) / transactions.length
          : 0,
      },

      // Categories breakdown
      categories: getCategories(products || []),

      // Top selling products
      topProducts: getTopProducts(transactions || []),

      // Period info
      period: {
        type: period,
        start: dateRange.start.toISOString(),
        end: dateRange.end.toISOString(),
        label: getPeriodLabel(period),
      }
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });

  } catch (error: any) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * Get date range based on period
 */
function getDateRange(period: string): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();

  switch (period) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'week':
      start.setDate(start.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      break;
    case 'month':
      start.setMonth(start.getMonth() - 1);
      start.setHours(0, 0, 0, 0);
      break;
    case 'year':
      start.setFullYear(start.getFullYear() - 1);
      start.setHours(0, 0, 0, 0);
      break;
    default:
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
  }

  return { start, end };
}

/**
 * Get period label
 */
function getPeriodLabel(period: string): string {
  switch (period) {
    case 'today':
      return 'Hari Ini';
    case 'week':
      return '7 Hari Terakhir';
    case 'month':
      return '30 Hari Terakhir';
    case 'year':
      return '1 Tahun Terakhir';
    default:
      return 'Hari Ini';
  }
}

/**
 * Get categories breakdown
 */
function getCategories(products: any[]) {
  const categories: { [key: string]: any } = {};

  products.forEach(product => {
    const cat = product.kategori || 'Lainnya';
    if (!categories[cat]) {
      categories[cat] = {
        name: cat,
        count: 0,
        totalStock: 0,
        totalValue: 0,
      };
    }
    categories[cat].count++;
    categories[cat].totalStock += product.stok;
    categories[cat].totalValue += product.stok * product.harga_jual;
  });

  return Object.values(categories);
}

/**
 * Get top selling products
 */
function getTopProducts(transactions: any[]) {
  const productSales: { [key: string]: any } = {};

  transactions.forEach(trans => {
    if (!productSales[trans.barcode_id]) {
      productSales[trans.barcode_id] = {
        barcode_id: trans.barcode_id,
        nama_produk: trans.nama_produk,
        quantity: 0,
        revenue: 0,
        profit: 0,
      };
    }
    productSales[trans.barcode_id].quantity += trans.jumlah;
    productSales[trans.barcode_id].revenue += trans.total_harga;
    productSales[trans.barcode_id].profit += trans.keuntungan;
  });

  return Object.values(productSales)
    .sort((a: any, b: any) => b.quantity - a.quantity)
    .slice(0, 10);
}

/**
 * POST /api/stats/refresh
 * Refresh/recalculate statistics
 */
export async function POST(request: NextRequest) {
  try {
    // This could be used to trigger cache refresh or recalculation
    // For now, just return success
    return NextResponse.json({
      success: true,
      message: 'Statistics refreshed',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
