import { useState, useCallback, useEffect } from 'react';
import { api } from '@/services/api';

export type AlertSeverity = 'high' | 'medium' | 'low';
export type AlertStatus = 'open' | 'investigating' | 'resolved';

export interface AlertItem {
  id: string;
  severity: AlertSeverity;
  type: string;
  batchId: string;
  drug: string;
  region: string;
  distributor: string;
  confidence: number;
  timestamp: string;
  status: AlertStatus;
  flaggedFeatures: string[];
  recommendation: string;
  timeline: { time: string; event: string; flagged?: boolean }[];
}

export type ResolutionAction = 'investigated' | 'escalate' | 'false_positive';

export function useAlerts() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ anomalies: AlertItem[] }>('/ml/anomalies')
      .then((r) => setAlerts(r.anomalies ?? []))
      .catch(() => setAlerts([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = alerts.filter((a) => {
    if (filter === 'all') return true;
    if (filter === 'open') return a.status === 'open' || a.status === 'investigating';
    if (filter === 'resolved') return a.status === 'resolved';
    return true;
  });

  const getAlert = useCallback(
    (id: string): AlertItem | undefined => alerts.find((a) => a.id === id),
    [alerts],
  );

  const resolveAlert = useCallback(
    async (id: string, action: ResolutionAction, notes?: string) => {
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: 'resolved' as AlertStatus } : a)),
      );
    },
    [],
  );

  return { alerts: filtered, filter, setFilter, getAlert, resolveAlert, loading };
}
