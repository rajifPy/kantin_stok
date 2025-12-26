import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { nama_produk, kategori, stok, harga_modal, harga_jual } = body;

    // Validation
    if (harga_jual && harga_modal && harga_jual <= harga_modal) {
      return NextResponse.json(
        { error: 'Harga jual harus lebih besar dari harga modal' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('products')
      .update({
        nama_produk,
        kategori,
        stok,
        harga_modal,
        harga_jual,
      })
      .eq('id', params.id)
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
      message: 'Produk berhasil diupdate' 
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', params.id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Produk berhasil dihapus' 
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Update stock
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { action, jumlah } = body;

    if (!action || !jumlah) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get current product
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .eq('id', params.id)
      .single();

    if (fetchError || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    let newStock = product.stok;

    if (action === 'add') {
      newStock += jumlah;
    } else if (action === 'reduce') {
      if (product.stok < jumlah) {
        return NextResponse.json(
          { error: 'Stok tidak cukup' },
          { status: 400 }
        );
      }
      newStock -= jumlah;
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    // Update stock
    const { data, error } = await supabase
      .from('products')
      .update({ stok: newStock })
      .eq('id', params.id)
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
      message: `Stok berhasil ${action === 'add' ? 'ditambah' : 'dikurangi'}` 
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}