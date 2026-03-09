import { useState, useCallback, useEffect } from 'react';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/auth-context';
import type { StockBadge } from '@/hooks/use-drugs';

export type PrescriptionStatus = 'active' | 'past';

export interface PrescriptionItem {
  id: string;
  drug: string;
  drugCode: string;
  form: string;
  dosage: string;
  doctor: string;
  hospital: string;
  prescribedDate: string;
  duration: string;
  status: PrescriptionStatus;
  refillsTotal: number;
  refillsUsed: number;
  nextRefillDate?: string;
  completedDate?: string;
  stockBadge: StockBadge;
  stockQty: number;
}

export interface PrescriptionDetail extends PrescriptionItem {
  nearbyFacilities: { name: string; distanceKm: number }[];
}

export function usePrescriptions() {
  const { wallet } = useAuth();
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'past'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!wallet) { setLoading(false); return; }
    setLoading(true);
    api.get<{ prescriptions: PrescriptionItem[] }>(`/prescriptions/${encodeURIComponent(wallet)}`)
      .then((r) => setPrescriptions(r.prescriptions))
      .catch(() => setPrescriptions([]))
      .finally(() => setLoading(false));
  }, [wallet]);

  const filtered = prescriptions.filter((p) => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const active = prescriptions.filter((p) => p.status === 'active');
  const past = prescriptions.filter((p) => p.status === 'past');

  const getDetail = useCallback(
    async (id: string): Promise<PrescriptionDetail | undefined> => {
      if (!wallet) return undefined;
      try {
        return await api.get<PrescriptionDetail>(`/prescriptions/${encodeURIComponent(wallet)}/${encodeURIComponent(id)}`);
      } catch {
        return undefined;
      }
    },
    [wallet],
  );

  return { prescriptions: filtered, active, past, filter, setFilter, getDetail, loading };
}
