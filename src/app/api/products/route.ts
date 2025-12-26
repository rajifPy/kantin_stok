import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Get all products
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const kategori = searchParams.get('kategori');
    const lowStock = searchParams.get('lowStock');

    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters
    if (search) {
      query = query.or(`nama_produk.ilike.%${search}%,barcode_id.ilike.%${search}%`);
    }

    if (kategori && kategori !== 'all') {
      query = query.eq('kategori', kategori);
    }

    if (lowStock === 'true') {
      query = query.lt('stok', 10);
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

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { barcode_id, nama_produk, kategori, stok, harga_modal, harga_jual } = body;

    // Validation
    if (!barcode_id || !nama_produk || !kategori) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (harga_jual <= harga_modal) {
      return NextResponse.json(
        { error: 'Harga jual harus lebih besar dari harga modal' },
        { status: 400 }
      );
    }

    // Check if barcode already exists
    const { data: existing } = await supabase
      .from('products')
      .select('barcode_id')
      .eq('barcode_id', barcode_id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Barcode ID sudah digunakan' },
        { status: 400 }
      );
    }

    // Insert new product
    const { data, error } = await supabase
      .from('products')
      .insert([{
        barcode_id,
        nama_produk,
        kategori,
        stok: stok || 0,
        harga_modal,
        harga_jual,
      }])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      data, 
      message: 'Produk berhasil ditambahkan' 
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}