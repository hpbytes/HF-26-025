import { useState, useCallback, useEffect } from 'react';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/auth-context';

export type TransferDirection = 'incoming' | 'outgoing';
export type TransferStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';

export interface TransferItem {
  id: string;
  batchId: string;
  drug: string;
  quantity: number;
  from: string;
  to: string;
  direction: TransferDirection;
  status: TransferStatus;
  initiatedDate: string;
  completedDate?: string;
  txHash?: string;
}

export interface InitiateTransferData {
  batchId: string;
  drug: string;
  quantity: number;
  toWallet: string;
  toName: string;
}

export interface TransferResult {
  transferId: string;
  batchId: string;
  txHash: string;
  blockNumber: number;
  timestamp: string;
  gasUsed: number;
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

const STATUS_MAP: Record<number, TransferStatus> = { 0: 'pending', 1: 'accepted', 2: 'rejected', 3: 'cancelled' };

function fmtDate(ts: number): string {
  if (!ts) return '';
  return new Date(ts * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function shortAddr(a: string): string {
  return a.length > 10 ? a.slice(0, 6) + '...' + a.slice(-4) : a;
}

export function useTransfers() {
  const { wallet } = useAuth();
  const [transfers, setTransfers] = useState<TransferItem[]>([]);
  const [directionFilter, setDirectionFilter] = useState<'all' | 'incoming' | 'outgoing'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [loading, setLoading] = useState(true);

  const loadTransfers = useCallback(async () => {
    if (!wallet) { setLoading(false); return; }
    setLoading(true);
    try {
      // Get pending transfers (incoming)
      const pending = await api.get<{ transfers: RawTransfer[] }>(`/transfers/pending/${encodeURIComponent(wallet)}`);

      // Also get owned batches so we can fetch their transfer history (outgoing)
      const owned = await api.get<{ batches: { batchId: string; drugName: string }[] }>(`/batches/by/owner/${encodeURIComponent(wallet)}`);

      const items: TransferItem[] = [];
      const seen = new Set<string>();

      // Map pending incoming
      for (const t of pending.transfers) {
        let drug = t.batchId;
        try { const b = await api.get<{ drugName: string }>(`/batches/${encodeURIComponent(t.batchId)}`); drug = b.drugName; } catch {}
        const dir: TransferDirection = t.to.toLowerCase() === wallet.toLowerCase() ? 'incoming' : 'outgoing';
        items.push({
          id: t.transferId, batchId: t.batchId, drug, quantity: t.quantity,
          from: shortAddr(t.from), to: shortAddr(t.to), direction: dir,
          status: STATUS_MAP[t.status] || 'pending', initiatedDate: fmtDate(t.initiatedAt),
          completedDate: t.completedAt ? fmtDate(t.completedAt) : undefined,
        });
        seen.add(t.transferId);
      }

      // Get transfer history for each owned batch
      for (const batch of owned.batches.slice(0, 10)) {
        try {
          const hist = await api.get<{ transfers: RawTransfer[] }>(`/transfers/history/${encodeURIComponent(batch.batchId)}`);
          for (const t of hist.transfers) {
            if (seen.has(t.transferId)) continue;
            seen.add(t.transferId);
            const dir: TransferDirection = t.to.toLowerCase() === wallet.toLowerCase() ? 'incoming' : 'outgoing';
            items.push({
              id: t.transferId, batchId: t.batchId, drug: batch.drugName, quantity: t.quantity,
              from: shortAddr(t.from), to: shortAddr(t.to), direction: dir,
              status: STATUS_MAP[t.status] || 'pending', initiatedDate: fmtDate(t.initiatedAt),
              completedDate: t.completedAt ? fmtDate(t.completedAt) : undefined,
            });
          }
        } catch { /* skip batch */ }
      }

      setTransfers(items);
    } catch {
      setTransfers([]);
    } finally {
      setLoading(false);
    }
  }, [wallet]);

  useEffect(() => { loadTransfers(); }, [loadTransfers]);

  const filtered = transfers.filter((t) => {
    if (directionFilter !== 'all' && t.direction !== directionFilter) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  });

  const pending = transfers.filter((t) => t.status === 'pending');

  const getTransfer = useCallback(
    (id: string): TransferItem | undefined => transfers.find((t) => t.id === id),
    [transfers],
  );

  const initiateTransfer = useCallback(async (data: InitiateTransferData): Promise<TransferResult> => {
    const res = await api.post<{ txHash: string; transferId: string }>('/transfers', {
      batchId: data.batchId,
      to: data.toWallet,
      quantity: data.quantity,
      toRegion: 'TN',
    });
    const result: TransferResult = {
      transferId: res.transferId,
      batchId: data.batchId,
      txHash: res.txHash,
      blockNumber: 0,
      timestamp: new Date().toISOString(),
      gasUsed: 0,
    };
    await loadTransfers();
    return result;
  }, [loadTransfers]);

  const acceptTransfer = useCallback(async (id: string) => {
    await api.post(`/transfers/${encodeURIComponent(id)}/accept`);
    await loadTransfers();
  }, [loadTransfers]);

  const rejectTransfer = useCallback(async (id: string) => {
    await api.post(`/transfers/${encodeURIComponent(id)}/reject`, { reason: 'Rejected' });
    await loadTransfers();
  }, [loadTransfers]);

  return { transfers: filtered, pending, directionFilter, setDirectionFilter, statusFilter, setStatusFilter, getTransfer, initiateTransfer, acceptTransfer, rejectTransfer, loading };
}
