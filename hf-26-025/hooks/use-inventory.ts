import { useState, useCallback, useEffect } from 'react';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/auth-context';

export type StockStatus = 'ok' | 'low' | 'critical';

export interface StockItem {
  drug: string;
  drugCode: string;
  totalQuantity: number;
  status: StockStatus;
  batches: BatchStock[];
}

export interface BatchStock {
  batchId: string;
  quantity: number;
  manufactureDate: string;
  expiryDate: string;
  manufacturer: string;
  receivedDate: string;
}

export interface IncomingShipment {
  transferId: string;
  batchId: string;
  drug: string;
  quantity: number;
  from: string;
  initiatedDate: string;
  status: 'pending' | 'in_transit';
}

function getStatus(qty: number): StockStatus {
  if (qty <= 50) return 'critical';
  if (qty <= 200) return 'low';
  return 'ok';
}

function fmtDate(ts: number): string {
  if (!ts) return '';
  return new Date(ts * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface RawBatch {
  batchId: string;
  drugName: string;
  region: string;
  quantity: number;
  expiryDate: number;
  status: number;
  isActive: boolean;
  manufactureDate?: number;
  registeredBy?: string;
  currentOwner?: string;
  registeredAt?: number;
}

interface RawTransfer {
  transferId: string;
  batchId: string;
  from: string;
  to: string;
  quantity: number;
  fromRegion: string;
  toRegion: string;
  initiatedAt: number;
  completedAt: number;
  status: number;
  rejectionReason: string;
}

export function useInventory() {
  const { wallet } = useAuth();
  const [stock, setStock] = useState<StockItem[]>([]);
  const [incoming, setIncoming] = useState<IncomingShipment[]>([]);
  const [filter, setFilter] = useState<'all' | 'ok' | 'low' | 'critical'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!wallet) { setLoading(false); return; }
    setLoading(true);

    const loadStock = api.get<{ batches: RawBatch[] }>(`/batches/by/owner/${encodeURIComponent(wallet)}`)
      .then(async (r) => {
        // Aggregate batches by drug
        const map = new Map<string, { drug: string; batches: RawBatch[] }>();
        for (const b of r.batches) {
          const key = b.drugName;
          if (!map.has(key)) map.set(key, { drug: key, batches: [] });
          map.get(key)!.batches.push(b);
        }

        const items: StockItem[] = [];
        for (const [, v] of map) {
          const totalQuantity = v.batches.reduce((s, b) => s + b.quantity, 0);
          items.push({
            drug: v.drug,
            drugCode: v.drug.slice(0, 4).toUpperCase(),
            totalQuantity,
            status: getStatus(totalQuantity),
            batches: v.batches.map((b) => ({
              batchId: b.batchId,
              quantity: b.quantity,
              manufactureDate: fmtDate(b.manufactureDate || 0),
              expiryDate: fmtDate(b.expiryDate),
              manufacturer: b.registeredBy ? b.registeredBy.slice(0, 6) + '...' + b.registeredBy.slice(-4) : 'Unknown',
              receivedDate: fmtDate(b.registeredAt || 0),
            })),
          });
        }
        setStock(items);
      })
      .catch(() => setStock([]));

    const loadIncoming = api.get<{ transfers: RawTransfer[] }>(`/transfers/pending/${encodeURIComponent(wallet)}`)
      .then(async (r) => {
        const shipments: IncomingShipment[] = [];
        for (const t of r.transfers) {
          // Look up drug name from batch
          let drug = t.batchId;
          try {
            const b = await api.get<{ drugName: string }>(`/batches/${encodeURIComponent(t.batchId)}`);
            drug = b.drugName;
          } catch { /* use batchId */ }

          shipments.push({
            transferId: t.transferId,
            batchId: t.batchId,
            drug,
            quantity: t.quantity,
            from: t.from.slice(0, 6) + '...' + t.from.slice(-4),
            initiatedDate: fmtDate(t.initiatedAt),
            status: 'pending',
          });
        }
        setIncoming(shipments);
      })
      .catch(() => setIncoming([]));

    Promise.all([loadStock, loadIncoming]).finally(() => setLoading(false));
  }, [wallet]);

  const filtered = stock.filter((s) => {
    if (filter === 'all') return true;
    return s.status === filter;
  });

  const summary = {
    total: stock.length,
    ok: stock.filter((s) => s.status === 'ok').length,
    low: stock.filter((s) => s.status === 'low').length,
    critical: stock.filter((s) => s.status === 'critical').length,
  };

  const getDrug = useCallback(
    (drugCode: string): StockItem | undefined => stock.find((s) => s.drugCode === drugCode),
    [stock],
  );

  const acceptShipment = useCallback(async (transferId: string) => {
    await api.post(`/transfers/${encodeURIComponent(transferId)}/accept`);
    setIncoming((prev) => prev.filter((s) => s.transferId !== transferId));
  }, []);

  const rejectShipment = useCallback(async (transferId: string, reason: string) => {
    await api.post(`/transfers/${encodeURIComponent(transferId)}/reject`, { reason });
    setIncoming((prev) => prev.filter((s) => s.transferId !== transferId));
  }, []);

  return { stock: filtered, incoming, filter, setFilter, summary, getDrug, acceptShipment, rejectShipment, loading };
}
