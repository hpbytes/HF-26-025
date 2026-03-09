import { useState, useCallback } from 'react';

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

const MOCK_STOCK: StockItem[] = [
  {
    drug: 'Paracetamol',
    drugCode: 'PARA',
    totalQuantity: 4200,
    status: 'ok',
    batches: [
      { batchId: 'BATCH_TN_PARA_20240602_A1B2C3', quantity: 2500, manufactureDate: '15 May 2024', expiryDate: '15 May 2026', manufacturer: 'PharmaCorp', receivedDate: '2 Jun 2024' },
      { batchId: 'BATCH_TN_PARA_20240520_D4E5F6', quantity: 1700, manufactureDate: '1 May 2024', expiryDate: '1 May 2026', manufacturer: 'PharmaCorp', receivedDate: '20 May 2024' },
    ],
  },
  {
    drug: 'Artemether',
    drugCode: 'ARTE',
    totalQuantity: 180,
    status: 'low',
    batches: [
      { batchId: 'BATCH_TN_ARTE_20240529_F3A1B2', quantity: 180, manufactureDate: '10 May 2024', expiryDate: '10 May 2025', manufacturer: 'MediGen Labs', receivedDate: '29 May 2024' },
    ],
  },
  {
    drug: 'Insulin',
    drugCode: 'INSU',
    totalQuantity: 42,
    status: 'critical',
    batches: [
      { batchId: 'BATCH_TN_INSU_20240601_C9D2E1', quantity: 42, manufactureDate: '20 May 2024', expiryDate: '20 Nov 2024', manufacturer: 'BioPharm India', receivedDate: '1 Jun 2024' },
    ],
  },
  {
    drug: 'Amoxicillin',
    drugCode: 'AMOX',
    totalQuantity: 1800,
    status: 'ok',
    batches: [
      { batchId: 'BATCH_TN_AMOX_20240530_E4F5D6', quantity: 1000, manufactureDate: '15 May 2024', expiryDate: '15 May 2026', manufacturer: 'PharmaCorp', receivedDate: '30 May 2024' },
      { batchId: 'BATCH_TN_AMOX_20240515_G7H8I9', quantity: 800, manufactureDate: '1 May 2024', expiryDate: '1 May 2026', manufacturer: 'MediGen Labs', receivedDate: '15 May 2024' },
    ],
  },
  {
    drug: 'Metformin',
    drugCode: 'METF',
    totalQuantity: 3200,
    status: 'ok',
    batches: [
      { batchId: 'BATCH_TN_METF_20240528_A1B2C3', quantity: 3200, manufactureDate: '10 May 2024', expiryDate: '10 May 2026', manufacturer: 'PharmaCorp', receivedDate: '28 May 2024' },
    ],
  },
  {
    drug: 'Chloroquine',
    drugCode: 'CHLO',
    totalQuantity: 150,
    status: 'low',
    batches: [
      { batchId: 'BATCH_TN_CHLO_20240515_AABB11', quantity: 150, manufactureDate: '1 May 2024', expiryDate: '1 May 2025', manufacturer: 'BioPharm India', receivedDate: '15 May 2024' },
    ],
  },
];

const MOCK_INCOMING: IncomingShipment[] = [
  { transferId: 't1', batchId: 'BATCH_TN_INSU_20240605_X1Y2Z3', drug: 'Insulin', quantity: 500, from: 'BioPharm India', initiatedDate: '5 Jun 2024', status: 'pending' },
  { transferId: 't2', batchId: 'BATCH_TN_ARTE_20240604_M3N4O5', drug: 'Artemether', quantity: 300, from: 'MediGen Labs', initiatedDate: '4 Jun 2024', status: 'in_transit' },
  { transferId: 't3', batchId: 'BATCH_TN_CHLO_20240603_P6Q7R8', drug: 'Chloroquine', quantity: 1000, from: 'PharmaCorp', initiatedDate: '3 Jun 2024', status: 'pending' },
];

export function useInventory() {
  const [stock] = useState<StockItem[]>(MOCK_STOCK);
  const [incoming] = useState<IncomingShipment[]>(MOCK_INCOMING);
  const [filter, setFilter] = useState<'all' | 'ok' | 'low' | 'critical'>('all');

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
    await new Promise((r) => setTimeout(r, 1000));
    // In production, call backend POST /transfers/:id/accept
  }, []);

  const rejectShipment = useCallback(async (transferId: string, reason: string) => {
    await new Promise((r) => setTimeout(r, 1000));
    // In production, call backend POST /transfers/:id/reject
  }, []);

  return { stock: filtered, incoming, filter, setFilter, summary, getDrug, acceptShipment, rejectShipment };
}
