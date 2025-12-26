import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * POST /api/barcode/scan
 * Validate and process scanned barcode
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { barcode_id } = body;

    if (!barcode_id) {
      return NextResponse.json(
        { error: 'Barcode ID required' },
        { status: 400 }
      );
    }

    // Search for product by barcode
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('barcode_id', barcode_id)
      .single();

    if (error || !product) {
      return NextResponse.json(
        { 
          error: 'Produk tidak ditemukan',
          barcode_id,
          found: false
        },
        { status: 404 }
      );
    }

    // Check stock
    const isLowStock = product.stok < 10;
    const isOutOfStock = product.stok === 0;

    return NextResponse.json({
      success: true,
      found: true,
      product: {
        id: product.id,
        barcode_id: product.barcode_id,
        nama_produk: product.nama_produk,
        kategori: product.kategori,
        stok: product.stok,
        harga_jual: product.harga_jual,
        harga_modal: product.harga_modal,
      },
      stock_status: {
        isLowStock,
        isOutOfStock,
        message: isOutOfStock 
          ? 'Stok habis' 
          : isLowStock 
            ? 'Stok menipis' 
            : 'Stok tersedia'
      }
    });

  } catch (error: any) {
    console.error('Barcode scan error:', error);
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
 * GET /api/barcode/scan?barcode_id=xxx
 * Alternative method using GET
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const barcode_id = searchParams.get('barcode_id');

    if (!barcode_id) {
      return NextResponse.json(
        { error: 'Barcode ID required in query parameter' },
        { status: 400 }
      );
    }

    // Search for product by barcode
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('barcode_id', barcode_id)
      .single();

    if (error || !product) {
      return NextResponse.json(
        { 
          error: 'Produk tidak ditemukan',
          barcode_id,
          found: false
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      found: true,
      product,
    });

  } catch (error: any) {
    console.error('Barcode scan error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
