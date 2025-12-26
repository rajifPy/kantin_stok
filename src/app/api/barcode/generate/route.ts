import { NextRequest, NextResponse } from 'next/server';
import JsBarcode from 'jsbarcode';
import { createCanvas } from 'canvas';

export async function POST(request: NextRequest) {
  try {
    const { barcode_id, nama_produk } = await request.json();

    if (!barcode_id) {
      return NextResponse.json(
        { error: 'Barcode ID required' },
        { status: 400 }
      );
    }

    // Create canvas
    const canvas = createCanvas(300, 100);
    
    // Generate barcode
    JsBarcode(canvas, barcode_id, {
      format: 'CODE128',
      width: 2,
      height: 60,
      displayValue: true,
      fontSize: 14,
      margin: 10,
    });

    // Convert to base64
    const buffer = canvas.toBuffer('image/png');
    const base64 = buffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64}`;

    return NextResponse.json({
      success: true,
      barcode_url: dataUrl,
      barcode_id,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}