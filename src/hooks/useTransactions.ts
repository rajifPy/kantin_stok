import { useState, useEffect } from 'react';
import { Transaction } from '@/types';

interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  limit?: number;
}

export function useTransactions(initialFilters?: TransactionFilters) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async (filters?: TransactionFilters) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      const finalFilters = { ...initialFilters, ...filters };

      if (finalFilters?.startDate) params.append('startDate', finalFilters.startDate);
      if (finalFilters?.endDate) params.append('endDate', finalFilters.endDate);
      if (finalFilters?.limit) params.append('limit', finalFilters.limit.toString());

      const res = await fetch(`/api/transactions?${params}`);
      if (!res.ok) throw new Error('Failed to fetch transactions');

      const { data } = await res.json();
      setTransactions(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (barcode_id: string, jumlah: number) => {
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode_id, jumlah }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }

      const { data } = await res.json();
      await fetchTransactions();
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const getStats = () => {
    const totalRevenue = transactions.reduce((sum, t) => sum + t.total_harga, 0);
    const totalProfit = transactions.reduce((sum, t) => sum + t.keuntungan, 0);
    const totalItems = transactions.reduce((sum, t) => sum + t.jumlah, 0);

    return {
      totalTransactions: transactions.length,
      totalRevenue,
      totalProfit,
      totalItems,
      avgTransaction: transactions.length > 0 ? totalRevenue / transactions.length : 0,
    };
  };

  const getTransactionsByDate = (date: string) => {
    return transactions.filter(t => t.created_at.startsWith(date));
  };

  const getTodayTransactions = () => {
    const today = new Date().toISOString().split('T')[0];
    return getTransactionsByDate(today);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    createTransaction,
    getStats,
    getTransactionsByDate,
    getTodayTransactions,
  };
}