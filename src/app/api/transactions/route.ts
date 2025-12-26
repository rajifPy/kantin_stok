import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Get all transactions
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = searchParams.get('limit');

    let query = supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply date filters
    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    // Apply limit
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data, count: data?.length || 0 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { barcode_id, jumlah } = body;

    if (!barcode_id || !jumlah || jumlah <= 0) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Get product by barcode
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('barcode_id', barcode_id)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Produk tidak ditemukan' },
        { status: 404 }
      );
    }

    // Check stock
    if (product.stok < jumlah) {
      return NextResponse.json(
        { error: `Stok tidak cukup. Stok tersedia: ${product.stok}` },
        { status: 400 }
      );
    }

    // Generate transaction ID
    const { data: lastTrans } = await supabase
      .from('transactions')
      .select('transaksi_id')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    let transaksi_id = 'TRX00001';
    if (lastTrans) {
      const lastNum = parseInt(lastTrans.transaksi_id.replace('TRX', ''));
      transaksi_id = `TRX${(lastNum + 1).toString().padStart(5, '0')}`;
    }

    // Calculate totals
    const total_harga = jumlah * product.harga_jual;
    const keuntungan = jumlah * (product.harga_jual - product.harga_modal);

    // Create transaction
    const { data: transaction, error: transError } = await supabase
      .from('transactions')
      .insert([{
        transaksi_id,
        product_id: product.id,
        barcode_id: product.barcode_id,
        nama_produk: product.nama_produk,
        jumlah,
        harga_satuan: product.harga_jual,
        total_harga,
        keuntungan,
      }])
      .select()
      .single();

    if (transError) {
      return NextResponse.json(
        { error: transError.message },
        { status: 500 }
      );
    }

    // Update stock
    const { error: stockError } = await supabase
      .from('products')
      .update({ stok: product.stok - jumlah })
      .eq('id', product.id);

    if (stockError) {
      // Rollback transaction if stock update fails
      await supabase
        .from('transactions')
        .delete()
        .eq('id', transaction.id);

      return NextResponse.json(
        { error: 'Gagal mengupdate stok' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      data: transaction, 
      message: 'Transaksi berhasil',
      stock_remaining: product.stok - jumlah
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}