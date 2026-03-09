import { useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';

export interface DistributorSummary {
  id: string;
  name: string;
  region: string;
  wallet: string;
  activeBatches: number;
  stockStatus: 'healthy' | 'low' | 'critical';
  lastTransferDays: number;
  alertCount: number;
}

export interface StockItem {
  drug: string;
  quantity: number;
  status: 'ok' | 'low' | 'critical';
}

export interface DemandSupplyItem {
  drug: string;
  demand: number;
  supply: number;
}

export interface TransferRecord {
  batchId: string;
  drug: string;
  quantity: number;
  date: string;
  status: 'received' | 'pending' | 'rejected';
}

export interface DistributorDetail extends DistributorSummary {
  stock: StockItem[];
  demandVsSupply: DemandSupplyItem[];
  recentTransfers: TransferRecord[];
}

interface RawDistributor {
  id: string;
  wallet: string;
  name: string;
  region: string;
}

interface RawBatch {
  batchId: string;
  drugName: string;
  quantity: number;
  status: number;
  isActive: boolean;
}

function getStockStatus(totalQty: number): 'healthy' | 'low' | 'critical' {
  if (totalQty <= 50) return 'critical';
  if (totalQty <= 200) return 'low';
  return 'healthy';
}

function shortAddr(a: string): string {
  return a.length > 10 ? a.slice(0, 6) + '...' + a.slice(-4) : a;
}

export function useDistributors() {
  const [distributors, setDistributors] = useState<DistributorSummary[]>([]);
  const [filter, setFilter] = useState<'all' | 'low' | 'critical' | 'inactive'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get<{ distributors: RawDistributor[] }>('/auth/distributors')
      .then(async (r) => {
        const summaries: DistributorSummary[] = await Promise.all(
          r.distributors.map(async (d) => {
            let activeBatches = 0;
            let totalQty = 0;
            try {
              const res = await api.get<{ batches: RawBatch[] }>(`/batches/by/owner/${encodeURIComponent(d.wallet)}`);
              activeBatches = res.batches.filter((b) => b.isActive).length;
              totalQty = res.batches.reduce((s, b) => s + b.quantity, 0);
            } catch { /* no batches */ }
            return {
              id: d.id,
              name: d.name,
              region: d.region,
              wallet: shortAddr(d.wallet),
              activeBatches,
              stockStatus: getStockStatus(totalQty),
              lastTransferDays: 0,
              alertCount: 0,
            };
          })
        );
        setDistributors(summaries);
      })
      .catch(() => setDistributors([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = distributors.filter((d) => {
    if (filter === 'all') return true;
    if (filter === 'low') return d.stockStatus === 'low';
    if (filter === 'critical') return d.stockStatus === 'critical';
    if (filter === 'inactive') return d.lastTransferDays > 10;
    return true;
  });

  const getDetail = useCallback((id: string): DistributorDetail | null => {
    const summary = distributors.find((d) => d.id === id);
    if (!summary) return null;
    return { ...summary, stock: [], demandVsSupply: [], recentTransfers: [] };
  }, [distributors]);

  return { distributors: filtered, filter, setFilter, getDetail, loading };
}
