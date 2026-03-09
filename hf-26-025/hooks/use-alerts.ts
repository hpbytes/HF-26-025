import { useState, useCallback } from 'react';

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

const MOCK_ALERTS: AlertItem[] = [
  {
    id: 'a1',
    severity: 'high',
    type: 'Unexplained Stock Drop',
    batchId: 'BATCH_TN_INSU_20240601_C9D2E1',
    drug: 'Insulin',
    region: 'Chennai',
    distributor: 'MedDist Chennai',
    confidence: 0.94,
    timestamp: '2 hours ago',
    status: 'open',
    flaggedFeatures: [
      'Stock dropped 62% in 4 hours',
      'No matching dispensing record',
      'Outside normal usage pattern',
    ],
    recommendation: 'Stock drop exceeds threshold with no dispensing record. Immediate investigation recommended.',
    timeline: [
      { time: '08:00', event: 'Stock: 420 units' },
      { time: '11:42', event: 'Stock: 158 units', flagged: true },
      { time: '12:00', event: 'Alert generated' },
    ],
  },
  {
    id: 'a2',
    severity: 'medium',
    type: 'Rapid Multi-Transfer',
    batchId: 'BATCH_TN_ARTE_20240529_F3A1B2',
    drug: 'Artemether',
    region: 'Madurai',
    distributor: 'HealthNet Madurai',
    confidence: 0.78,
    timestamp: '6 hours ago',
    status: 'open',
    flaggedFeatures: [
      '4 transfers initiated within 3 hours',
      'Unusual transfer velocity for this drug',
      'Destination diversity anomaly',
    ],
    recommendation: 'Monitor transfer pattern. May indicate legitimate bulk distribution or unauthorized movement.',
    timeline: [
      { time: '06:10', event: 'Transfer #1 initiated' },
      { time: '07:25', event: 'Transfer #2 initiated' },
      { time: '08:40', event: 'Transfer #3 initiated' },
      { time: '09:05', event: 'Transfer #4 initiated', flagged: true },
      { time: '09:10', event: 'Alert generated' },
    ],
  },
  {
    id: 'a3',
    severity: 'low',
    type: 'Off-hours Transfer',
    batchId: 'BATCH_TN_AMX_20240530_E4F5D6',
    drug: 'Amoxicillin',
    region: 'Coimbatore',
    distributor: 'PharmaLink Coimbatore',
    confidence: 0.52,
    timestamp: '1 Jun 2024',
    status: 'resolved',
    flaggedFeatures: [
      'Transfer initiated at 02:15 AM',
      'Outside standard operating hours (6AM–10PM)',
    ],
    recommendation: 'Low confidence anomaly. Likely authorized after-hours operation.',
    timeline: [
      { time: '02:15', event: 'Transfer initiated', flagged: true },
      { time: '02:16', event: 'Alert generated' },
      { time: '09:00', event: 'Marked as investigated' },
    ],
  },
  {
    id: 'a4',
    severity: 'high',
    type: 'Stock Reconciliation Failure',
    batchId: 'BATCH_TN_METF_20240528_A1B2C3',
    drug: 'Metformin',
    region: 'Salem',
    distributor: 'MedFlow Salem',
    confidence: 0.91,
    timestamp: '1 day ago',
    status: 'investigating',
    flaggedFeatures: [
      'On-chain quantity differs from reported stock by 340 units',
      'No transfer or dispensing to account for discrepancy',
      'Pattern matches known diversion signature',
    ],
    recommendation: 'Escalate immediately. Stock discrepancy with no audit trail suggests potential diversion.',
    timeline: [
      { time: '14:00', event: 'Reconciliation check triggered' },
      { time: '14:01', event: 'Discrepancy detected: 340 units', flagged: true },
      { time: '14:02', event: 'Alert generated' },
      { time: '16:30', event: 'Marked as investigating' },
    ],
  },
];

export function useAlerts() {
  const [alerts, setAlerts] = useState<AlertItem[]>(MOCK_ALERTS);
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');

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
      await new Promise((r) => setTimeout(r, 800));
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: 'resolved' as AlertStatus } : a)),
      );
    },
    [],
  );

  return { alerts: filtered, filter, setFilter, getAlert, resolveAlert };
}
