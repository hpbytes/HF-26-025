import { useState, useEffect, useCallback } from 'react';

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

const MOCK_LIST: DistributorSummary[] = [
  { id: 'd1', name: 'MedDist Chennai', region: 'Chennai', wallet: '0x123...def', activeBatches: 12, stockStatus: 'low', lastTransferDays: 2, alertCount: 2 },
  { id: 'd2', name: 'PharmaLink Coimbatore', region: 'Coimbatore', wallet: '0x456...abc', activeBatches: 8, stockStatus: 'healthy', lastTransferDays: 5, alertCount: 0 },
  { id: 'd3', name: 'HealthNet Madurai', region: 'Madurai', wallet: '0x789...012', activeBatches: 5, stockStatus: 'critical', lastTransferDays: 12, alertCount: 1 },
  { id: 'd4', name: 'CareSupply Trichy', region: 'Trichy', wallet: '0xabc...345', activeBatches: 9, stockStatus: 'healthy', lastTransferDays: 3, alertCount: 0 },
  { id: 'd5', name: 'MedFlow Salem', region: 'Salem', wallet: '0xdef...678', activeBatches: 6, stockStatus: 'low', lastTransferDays: 8, alertCount: 1 },
];

const MOCK_DETAIL: Record<string, Omit<DistributorDetail, keyof DistributorSummary>> = {
  d1: {
    stock: [
      { drug: 'Paracetamol', quantity: 4200, status: 'ok' },
      { drug: 'Artemether', quantity: 180, status: 'low' },
      { drug: 'Insulin', quantity: 42, status: 'critical' },
      { drug: 'Amoxicillin', quantity: 1800, status: 'ok' },
    ],
    demandVsSupply: [
      { drug: 'Paracetamol', demand: 3500, supply: 4200 },
      { drug: 'Artemether', demand: 400, supply: 180 },
      { drug: 'Insulin', demand: 300, supply: 42 },
      { drug: 'Amoxicillin', demand: 1200, supply: 1800 },
    ],
    recentTransfers: [
      { batchId: 'BATCH_TN_PARA_20240602_A1B2C3', drug: 'Paracetamol', quantity: 5000, date: '2 Jun 2024', status: 'received' },
      { batchId: 'BATCH_TN_ARTE_20240528_D4E5F6', drug: 'Artemether', quantity: 500, date: '28 May 2024', status: 'received' },
      { batchId: 'BATCH_TN_INSU_20240520_789ABC', drug: 'Insulin', quantity: 200, date: '20 May 2024', status: 'received' },
    ],
  },
  d3: {
    stock: [
      { drug: 'Insulin', quantity: 18, status: 'critical' },
      { drug: 'Paracetamol', quantity: 900, status: 'low' },
      { drug: 'Chloroquine', quantity: 2100, status: 'ok' },
    ],
    demandVsSupply: [
      { drug: 'Insulin', demand: 250, supply: 18 },
      { drug: 'Paracetamol', demand: 1500, supply: 900 },
      { drug: 'Chloroquine', demand: 800, supply: 2100 },
    ],
    recentTransfers: [
      { batchId: 'BATCH_TN_CHLO_20240515_AABB11', drug: 'Chloroquine', quantity: 3000, date: '15 May 2024', status: 'received' },
    ],
  },
};

function getDefaultDetail(summary: DistributorSummary): Omit<DistributorDetail, keyof DistributorSummary> {
  return {
    stock: [
      { drug: 'Paracetamol', quantity: 2000, status: 'ok' },
      { drug: 'Metformin', quantity: 1500, status: 'ok' },
    ],
    demandVsSupply: [
      { drug: 'Paracetamol', demand: 1800, supply: 2000 },
      { drug: 'Metformin', demand: 1200, supply: 1500 },
    ],
    recentTransfers: [
      { batchId: 'BATCH_TN_PARA_20240601_XYZ123', drug: 'Paracetamol', quantity: 3000, date: '1 Jun 2024', status: 'received' },
    ],
  };
}

export function useDistributors() {
  const [distributors] = useState<DistributorSummary[]>(MOCK_LIST);
  const [filter, setFilter] = useState<'all' | 'low' | 'critical' | 'inactive'>('all');

  const filtered = distributors.filter((d) => {
    if (filter === 'all') return true;
    if (filter === 'low') return d.stockStatus === 'low';
    if (filter === 'critical') return d.stockStatus === 'critical';
    if (filter === 'inactive') return d.lastTransferDays > 10;
    return true;
  });

  const getDetail = useCallback((id: string): DistributorDetail | null => {
    const summary = MOCK_LIST.find((d) => d.id === id);
    if (!summary) return null;
    const extra = MOCK_DETAIL[id] || getDefaultDetail(summary);
    return { ...summary, ...extra };
  }, []);

  return { distributors: filtered, filter, setFilter, getDetail };
}
