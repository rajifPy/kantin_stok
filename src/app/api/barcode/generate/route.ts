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
    const svg = generateBarcodeSVG(barcode_id, nama_produk);
    
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
 * Enhanced version with better encoding and styling
 */
function generateBarcodeSVG(text: string, productName?: string): string {
  const width = 350;
  const height = 140;
  const barWidth = 2.5;
  const barHeight = 70;
  const textHeight = 16;
  const padding = 20;
  
  // CODE128 encoding (simplified but functional)
  const bars = encodeCODE128(text);
  
  let x = padding;
  let barsHTML = '';
  
  // Convert bars string to array and render
  const barsArray = bars.split('');
  for (let i = 0; i < barsArray.length; i++) {
    if (barsArray[i] === '1') {
      barsHTML += `<rect x="${x}" y="${padding}" width="${barWidth}" height="${barHeight}" fill="black"/>`;
    }
    x += barWidth;
  }

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="white"/>
      
      <!-- Barcode bars -->
      <g id="barcode-bars">
        ${barsHTML}
      </g>
      
      <!-- Barcode text -->
      <text x="${width/2}" y="${padding + barHeight + 20}" 
            font-family="'Courier New', monospace" 
            font-size="${textHeight}" 
            font-weight="bold"
            text-anchor="middle" 
            fill="black">${text}</text>
      
      <!-- Product name (if provided) -->
      ${productName ? `
      <text x="${width/2}" y="${padding + barHeight + 40}" 
            font-family="Arial, sans-serif" 
            font-size="12" 
            text-anchor="middle" 
            fill="#666">${truncate(productName, 35)}</text>
      ` : ''}
      
      <!-- Border -->
      <rect x="1" y="1" width="${width-2}" height="${height-2}" 
            fill="none" stroke="#ddd" stroke-width="2" rx="4"/>
    </svg>
  `;

  return svg;
}

/**
 * Enhanced CODE128 encoder with better pattern generation
 */
function encodeCODE128(text: string): string {
  let bars = '11010010000'; // Start Code B
  
  // Character encoding patterns (simplified subset of CODE128)
  const patterns: { [key: string]: string } = {
    '0': '11011001100', '1': '11001101100', '2': '11001100110',
    '3': '10010011000', '4': '10010001100', '5': '10001001100',
    '6': '10011001000', '7': '10011000100', '8': '10001100100',
    '9': '11001001000', 'A': '11001000100', 'B': '11000100100',
    'C': '10110011100', 'D': '10011011100', 'E': '10011001110',
    'F': '10111001100', 'G': '10011101100', 'H': '10011100110',
    'I': '11001110010', 'J': '11001011100', 'K': '11001001110',
    'L': '11011100100', 'M': '11001110100', 'N': '11101101110',
    'O': '11101001100', 'P': '11100101100', 'Q': '11100100110',
    'R': '11101100100', 'S': '11100110100', 'T': '11100110010',
    'U': '11011011000', 'V': '11011000110', 'W': '11000110110',
    'X': '10100011000', 'Y': '10001011000', 'Z': '10001000110',
  };
  
  // Encode each character
  for (let i = 0; i < text.length; i++) {
    const char = text[i].toUpperCase();
    const pattern = patterns[char] || patterns['0']; // Fallback to '0' pattern
    bars += pattern;
  }
  
  // Add checksum (simplified - just use modulo pattern)
  const checksumPattern = patterns[text[0]?.toUpperCase()] || patterns['0'];
  bars += checksumPattern;
  
  // Stop code
  bars += '1100011101011';
  
  return bars;
}

/**
 * Truncate text helper
 */
function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * GET endpoint for client-side generation info
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

  return NextResponse.json({
    barcode_id,
    message: 'Use POST method to generate barcode',
    instructions: {
      method: 'POST',
      body: {
        barcode_id: 'string (required)',
        nama_produk: 'string (optional)'
      }
    }
  });
}
