import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { barcode_id, nama_produk } = await request.json();

    if (!barcode_id) {
      return NextResponse.json(
        { error: 'Barcode ID required' },
        { status: 400 }
      );
    }

    // Generate SVG barcode instead of PNG (no canvas dependency)
    const svg = generateBarcodeSVG(barcode_id);
    
    // Convert SVG to base64
    const base64 = Buffer.from(svg).toString('base64');
    const dataUrl = `data:image/svg+xml;base64,${base64}`;

    return NextResponse.json({
      success: true,
      barcode_url: dataUrl,
      barcode_id,
      format: 'svg',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/**
 * Generate CODE128 barcode as SVG
 * This is a simplified implementation that works without canvas
 */
function generateBarcodeSVG(text: string): string {
  const width = 300;
  const height = 100;
  const barWidth = 2;
  const barHeight = 60;
  const textHeight = 14;
  
  // CODE128 encoding (simplified - basic implementation)
  // In production, you might want to use a proper CODE128 encoder
  const bars = encodeCODE128(text);
  
  let x = 20; // Start position
  let barsHTML = '';
  
  bars.forEach(bar => {
    if (bar === '1') {
      barsHTML += `<rect x="${x}" y="10" width="${barWidth}" height="${barHeight}" fill="black"/>`;
    }
    x += barWidth;
  });

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="white"/>
      ${barsHTML}
      <text x="${width/2}" y="${barHeight + 10 + textHeight}" 
            font-family="monospace" font-size="${textHeight}" 
            text-anchor="middle" fill="black">${text}</text>
    </svg>
  `;

  return svg;
}

/**
 * Simple CODE128 encoder
 * This is a basic implementation - for production use a proper library
 */
function encodeCODE128(text: string): string {
  // Simplified: just create alternating bars for visualization
  // In production, implement proper CODE128 encoding
  let bars = '11010010000'; // Start code
  
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    // Simple pattern based on char code
    const pattern = (charCode % 2 === 0) ? '10001011000' : '10100011000';
    bars += pattern;
  }
  
  bars += '1100011101011'; // Stop code
  
  return bars;
}

/**
 * Alternative: Return barcode.js library CDN link for client-side generation
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const barcode_id = searchParams.get('barcode_id');

  if (!barcode_id) {
    return NextResponse.json(
      { error: 'Barcode ID required' },
      { status: 400 }
    );
  }

  // Return instructions for client-side generation using JsBarcode
  return NextResponse.json({
    barcode_id,
    instructions: {
      library: 'JsBarcode',
      cdn: 'https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js',
      usage: `
        <svg id="barcode"></svg>
        <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"></script>
        <script>
          JsBarcode("#barcode", "${barcode_id}", {
            format: "CODE128",
            width: 2,
            height: 60,
            displayValue: true
          });
        </script>
      `
    }
  });
}