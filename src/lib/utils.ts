import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Currency formatting
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Date formatting
export function formatDate(date: string | Date): string {
  return format(new Date(date), 'dd MMM yyyy');
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'dd MMM yyyy, HH:mm');
}

export function formatTime(date: string | Date): string {
  return format(new Date(date), 'HH:mm:ss');
}

// Number formatting
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num);
}

// Calculate profit margin
export function calculateProfitMargin(hargaJual: number, hargaModal: number): number {
  if (hargaJual === 0) return 0;
  return ((hargaJual - hargaModal) / hargaJual) * 100;
}

// Calculate profit
export function calculateProfit(jumlah: number, hargaJual: number, hargaModal: number): number {
  return jumlah * (hargaJual - hargaModal);
}

// Validate barcode format
export function validateBarcodeFormat(barcode: string): boolean {
  // Basic validation: alphanumeric, 3-50 characters, no spaces
  const regex = /^[A-Z0-9]{3,50}$/;
  return regex.test(barcode);
}

// Generate random barcode ID
export function generateBarcodeId(): string {
  const prefix = 'BRK';
  const randomNum = Math.floor(Math.random() * 9999) + 1;
  return `${prefix}${randomNum.toString().padStart(4, '0')}`;
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// Check if stock is low
export function isLowStock(stock: number, threshold: number = 10): boolean {
  return stock < threshold;
}

// Get stock status
export function getStockStatus(stock: number): {
  status: 'high' | 'medium' | 'low' | 'out';
  color: string;
  label: string;
} {
  if (stock === 0) {
    return { status: 'out', color: 'red', label: 'Habis' };
  } else if (stock < 10) {
    return { status: 'low', color: 'orange', label: 'Menipis' };
  } else if (stock < 30) {
    return { status: 'medium', color: 'yellow', label: 'Sedang' };
  } else {
    return { status: 'high', color: 'green', label: 'Aman' };
  }
}

// Truncate text
export function truncate(text: string, length: number = 50): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

// Sleep function
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Generate transaction ID
export function generateTransactionId(lastId?: string): string {
  if (!lastId) {
    return 'TRX00001';
  }
  
  const num = parseInt(lastId.replace('TRX', '')) + 1;
  return `TRX${num.toString().padStart(5, '0')}`;
}

// Group array by key
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const group = String(item[key]);
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

// Calculate percentage
export function calculatePercentage(part: number, total: number): number {
  if (total === 0) return 0;
  return (part / total) * 100;
}

// Format percentage
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

// Get date range for reports
export function getDateRange(range: 'today' | 'week' | 'month' | 'year'): {
  start: Date;
  end: Date;
} {
  const end = new Date();
  const start = new Date();

  switch (range) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'week':
      start.setDate(start.getDate() - 7);
      break;
    case 'month':
      start.setMonth(start.getMonth() - 1);
      break;
    case 'year':
      start.setFullYear(start.getFullYear() - 1);
      break;
  }

  return { start, end };
}

// Download as CSV
export function downloadCSV(data: any[], filename: string) {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',')
          ? `"${value}"`
          : value;
      }).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}