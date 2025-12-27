'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';
import { ShoppingCart, Plus, Minus, Trash2, Check, ArrowLeft, Barcode as BarcodeIcon, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface CartItem {
  barcode_id: string;
  nama_produk: string;
  harga_jual: number;
  harga_modal: number;
  quantity: number;
  stok_tersedia: number;
}

// Separate component to handle searchParams
function TransactionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const barcodeParam = searchParams.get('barcode');

  const [cart, setCart] = useState<CartItem[]>([]);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (barcodeParam) {
      handleScanBarcode(barcodeParam);
    }
  }, [barcodeParam]);

  const handleScanBarcode = async (barcode: string) => {
    if (!barcode.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/barcode/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode_id: barcode }),
      });

      const data = await res.json();

      if (res.ok && data.found) {
        addToCart(data.product);
        setBarcodeInput('');
      } else {
        setError(data.error || 'Produk tidak ditemukan');
      }
    } catch (err) {
      setError('Gagal mencari produk');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.barcode_id === product.barcode_id);

    if (existingItem) {
      if (existingItem.quantity >= product.stok) {
        setError(`Stok tidak cukup. Tersedia: ${product.stok}`);
        return;
      }
      setCart(cart.map(item =>
        item.barcode_id === product.barcode_id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      if (product.stok === 0) {
        setError('Produk habis stok');
        return;
      }
      setCart([...cart, {
        barcode_id: product.barcode_id,
        nama_produk: product.nama_produk,
        harga_jual: product.harga_jual,
        harga_modal: product.harga_modal,
        quantity: 1,
        stok_tersedia: product.stok,
      }]);
    }

    setSuccess(`${product.nama_produk} ditambahkan ke keranjang`);
    setTimeout(() => setSuccess(''), 2000);
  };

  const updateQuantity = (barcode_id: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.barcode_id === barcode_id) {
        const newQty = item.quantity + delta;
        if (newQty <= 0) return item;
        if (newQty > item.stok_tersedia) {
          setError(`Stok tidak cukup. Tersedia: ${item.stok_tersedia}`);
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (barcode_id: string) => {
    setCart(cart.filter(item => item.barcode_id !== barcode_id));
  };

  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.harga_jual * item.quantity), 0);
    const profit = cart.reduce((sum, item) => sum + ((item.harga_jual - item.harga_modal) * item.quantity), 0);
    return { subtotal, profit };
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setError('Keranjang kosong');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const promises = cart.map(item =>
        fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            barcode_id: item.barcode_id,
            jumlah: item.quantity,
          }),
        })
      );

      const results = await Promise.all(promises);
      const allSuccess = results.every(res => res.ok);

      if (allSuccess) {
        setSuccess('Transaksi berhasil!');
        setCart([]);
        setTimeout(() => {
          router.push('/dashboard/transactions');
        }, 1500);
      } else {
        setError('Beberapa transaksi gagal. Silakan coba lagi.');
      }
    } catch (err) {
      setError('Gagal memproses transaksi');
    } finally {
      setProcessing(false);
    }
  };

  const { subtotal, profit } = calculateTotals();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                href="/dashboard/transactions"
                className="p-2 hover:bg-gray-100 rounded-xl transition-all hover:scale-110"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                  <ShoppingCart className="text-white" size={22} />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Transaksi Baru
                  </h1>
                  <p className="hidden sm:block text-xs sm:text-sm text-gray-600 mt-0.5">
                    Scan atau input barcode produk
                  </p>
                </div>
              </div>
            </div>
            
            {/* Cart Badge Mobile */}
            <div className="sm:hidden">
              <div className="relative">
                <ShoppingCart className="text-gray-600" size={24} />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce-in">
                    {cart.length}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Scanner & Cart */}
          <div className="lg:col-span-2 space-y-6">
            {/* Enhanced Barcode Scanner */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                      <BarcodeIcon className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                        Scan Produk
                        <Sparkles size={18} className="animate-pulse" />
                      </h3>
                      <p className="text-blue-100 text-xs sm:text-sm">
                        Ketik atau scan barcode
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value.toUpperCase())}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleScanBarcode(barcodeInput);
                      }
                    }}
                    placeholder="Masukkan barcode..."
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-base sm:text-lg transition-all"
                    disabled={loading}
                    autoFocus
                  />
                  <button
                    onClick={() => handleScanBarcode(barcodeInput)}
                    disabled={loading || !barcodeInput}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span className="hidden sm:inline">Mencari...</span>
                      </>
                    ) : (
                      <>
                        <Plus size={20} />
                        <span>Tambah</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-4">
                  <Link
                    href="/dashboard/scan"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    <BarcodeIcon size={16} />
                    <span>Gunakan Scanner Kamera</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Notifications */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl animate-shake shadow-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-red-800 font-medium text-sm">{error}</p>
                  </div>
                  <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-xl animate-bounce-in shadow-lg">
                <div className="flex items-center gap-3">
                  <Check className="text-green-500" size={20} />
                  <span className="text-green-800 font-medium text-sm">{success}</span>
                </div>
              </div>
            )}

            {/* Enhanced Shopping Cart */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                    <ShoppingCart className="text-blue-600" size={24} />
                    Keranjang Belanja
                  </h3>
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                    {cart.length} item
                  </span>
                </div>
              </div>

              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="text-center py-16 px-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingCart className="w-10 h-10 text-blue-600" />
                    </div>
                    <p className="text-gray-500 text-lg font-medium">Keranjang kosong</p>
                    <p className="text-gray-400 text-sm mt-2">Scan barcode untuk menambah produk</p>
                  </div>
                ) : (
                  cart.map((item, index) => (
                    <div key={item.barcode_id} className="p-4 sm:p-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 animate-fade-in-up" style={{animationDelay: `${index * 50}ms`}}>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 text-base sm:text-lg mb-1 truncate">
                            {item.nama_produk}
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-500 font-mono">{item.barcode_id}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.barcode_id)}
                          className="self-end sm:self-start p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.barcode_id, -1)}
                            disabled={item.quantity <= 1}
                            className="w-10 h-10 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-all hover:scale-110"
                          >
                            <Minus size={18} />
                          </button>
                          <span className="w-12 text-center text-xl font-bold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.barcode_id, 1)}
                            disabled={item.quantity >= item.stok_tersedia}
                            className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                          >
                            <Plus size={18} />
                          </button>
                        </div>

                        <div className="text-left sm:text-right w-full sm:w-auto">
                          <p className="text-xs sm:text-sm text-gray-600 mb-1">
                            {formatCurrency(item.harga_jual)} × {item.quantity}
                          </p>
                          <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            {formatCurrency(item.harga_jual * item.quantity)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                        <span className="text-gray-500 flex items-center gap-1">
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                          Stok tersedia: <strong className="text-gray-700">{item.stok_tersedia}</strong>
                        </span>
                        <span className="text-green-600 font-semibold">
                          Profit: {formatCurrency((item.harga_jual - item.harga_modal) * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Summary & Checkout */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-24">
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Sparkles size={20} className="animate-pulse" />
                  Ringkasan
                </h3>
              </div>

              <div className="p-6 space-y-6">
                {/* Summary Items */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Total Item:</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl px-4">
                    <span className="text-green-700 font-semibold flex items-center gap-2">
                      <Sparkles size={16} />
                      Keuntungan:
                    </span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatCurrency(profit)}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={cart.length === 0 || processing}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                >
                  {processing ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Memproses...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Check size={24} />
                      <span>Checkout Sekarang</span>
                    </div>
                  )}
                </button>

                {/* Clear Cart */}
                {cart.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm('Hapus semua item dari keranjang?')) {
                        setCart([]);
                      }
                    }}
                    className="w-full px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-semibold transition-all border-2 border-red-200 hover:border-red-300"
                  >
                    <Trash2 size={18} className="inline mr-2" />
                    Kosongkan Keranjang
                  </button>
                )}

                {/* Quick Tips */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 mt-6 border border-blue-100">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    💡 Tips Cepat
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">✓</span>
                      <span>Tekan Enter untuk scan</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">✓</span>
                      <span>Gunakan webcam scanner</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">✓</span>
                      <span>Cek stok sebelum checkout</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense wrapper
export default function NewTransactionPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-700 font-semibold text-lg">Memuat...</p>
        </div>
      </div>
    }>
      <TransactionContent />
    </Suspense>
  );
}
