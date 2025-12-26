// Barcode utility functions

/**
 * Generate a random barcode ID
 * Format: BRK + 4 digits (e.g., BRK0001)
 */
export function generateBarcodeId(): string {
  const prefix = 'BRK';
  const randomNum = Math.floor(Math.random() * 9999) + 1;
  return `${prefix}${randomNum.toString().padStart(4, '0')}`;
}

/**
 * Validate barcode format
 * Rules: Alphanumeric, 3-50 characters, uppercase, no spaces
 */
export function validateBarcodeFormat(barcode: string): boolean {
  const regex = /^[A-Z0-9]{3,50}$/;
  return regex.test(barcode);
}

/**
 * Generate barcode as SVG (client-side)
 * This requires JsBarcode library
 */
export function generateBarcodeSVG(text: string, elementId: string): void {
  if (typeof window !== 'undefined' && (window as any).JsBarcode) {
    const element = document.getElementById(elementId);
    if (element) {
      (window as any).JsBarcode(element, text, {
        format: 'CODE128',
        width: 2,
        height: 60,
        displayValue: true,
        fontSize: 14,
        margin: 10,
      });
    }
  }
}

/**
 * Get barcode type from string
 */
export function getBarcodeType(barcode: string): string {
  if (/^\d{8}$/.test(barcode)) return 'EAN-8';
  if (/^\d{13}$/.test(barcode)) return 'EAN-13';
  if (/^\d{12}$/.test(barcode)) return 'UPC-A';
  if (/^[A-Z0-9]{3,50}$/.test(barcode)) return 'CODE128';
  return 'UNKNOWN';
}

/**
 * Format barcode for display
 * Add spaces for readability
 */
export function formatBarcodeDisplay(barcode: string): string {
  // For numeric barcodes, add spaces every 4 digits
  if (/^\d+$/.test(barcode)) {
    return barcode.replace(/(\d{4})/g, '$1 ').trim();
  }
  return barcode;
}

/**
 * Check if barcode is valid checksum (for EAN/UPC)
 */
export function validateEANChecksum(barcode: string): boolean {
  if (!/^\d{8}$|^\d{13}$/.test(barcode)) return false;

  const digits = barcode.split('').map(Number);
  const checkDigit = digits.pop()!;
  
  let sum = 0;
  digits.forEach((digit, index) => {
    sum += digit * (index % 2 === 0 ? 1 : 3);
  });
  
  const calculatedCheck = (10 - (sum % 10)) % 10;
  return calculatedCheck === checkDigit;
}

/**
 * Calculate EAN-13 checksum digit
 */
export function calculateEANChecksum(barcode: string): number {
  if (barcode.length !== 12) {
    throw new Error('Barcode must be 12 digits for EAN-13');
  }

  const digits = barcode.split('').map(Number);
  let sum = 0;
  
  digits.forEach((digit, index) => {
    sum += digit * (index % 2 === 0 ? 1 : 3);
  });
  
  return (10 - (sum % 10)) % 10;
}

/**
 * Sanitize barcode input
 * Remove spaces, convert to uppercase
 */
export function sanitizeBarcodeInput(input: string): string {
  return input.trim().toUpperCase().replace(/\s+/g, '');
}

/**
 * Check if barcode exists in product list
 */
export function isBarcodeUnique(barcode: string, existingBarcodes: string[]): boolean {
  return !existingBarcodes.includes(barcode);
}

/**
 * Generate multiple unique barcode IDs
 */
export function generateUniqueBarcodeIds(count: number, existingBarcodes: string[] = []): string[] {
  const barcodes: string[] = [];
  const allBarcodes = new Set(existingBarcodes);

  while (barcodes.length < count) {
    const newBarcode = generateBarcodeId();
    if (!allBarcodes.has(newBarcode)) {
      barcodes.push(newBarcode);
      allBarcodes.add(newBarcode);
    }
  }

  return barcodes;
}

/**
 * Parse barcode scan result
 */
export interface BarcodeScanResult {
  text: string;
  format: string;
  isValid: boolean;
  error?: string;
}

export function parseBarcodeScanResult(rawText: string, format: string): BarcodeScanResult {
  const sanitized = sanitizeBarcodeInput(rawText);
  
  const result: BarcodeScanResult = {
    text: sanitized,
    format,
    isValid: false,
  };

  // Validate based on format
  if (format.includes('EAN') || format.includes('UPC')) {
    result.isValid = validateEANChecksum(sanitized);
    if (!result.isValid) {
      result.error = 'Invalid checksum';
    }
  } else {
    result.isValid = validateBarcodeFormat(sanitized);
    if (!result.isValid) {
      result.error = 'Invalid format';
    }
  }

  return result;
}

/**
 * Get barcode image URL (for printing/display)
 * This would typically call an API endpoint
 */
export async function getBarcodeImageUrl(barcode: string): Promise<string> {
  try {
    const response = await fetch('/api/barcode/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ barcode_id: barcode }),
    });

    const data = await response.json();
    return data.barcode_url;
  } catch (error) {
    console.error('Error generating barcode:', error);
    throw error;
  }
}