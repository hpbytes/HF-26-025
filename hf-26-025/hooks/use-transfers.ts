import { useState, useCallback } from 'react';

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

const MOCK_TRANSFERS: TransferItem[] = [
  { id: 'tr1', batchId: 'BATCH_TN_PARA_20240602_A1B2C3', drug: 'Paracetamol', quantity: 2500, from: 'PharmaCorp', to: 'MedDist Chennai', direction: 'incoming', status: 'accepted', initiatedDate: '1 Jun 2024', completedDate: '2 Jun 2024', txHash: '0xabc123...def' },
  { id: 'tr2', batchId: 'BATCH_TN_INSU_20240605_X1Y2Z3', drug: 'Insulin', quantity: 500, from: 'BioPharm India', to: 'MedDist Chennai', direction: 'incoming', status: 'pending', initiatedDate: '5 Jun 2024' },
  { id: 'tr3', batchId: 'BATCH_TN_ARTE_20240604_M3N4O5', drug: 'Artemether', quantity: 300, from: 'MediGen Labs', to: 'MedDist Chennai', direction: 'incoming', status: 'pending', initiatedDate: '4 Jun 2024' },
  { id: 'tr4', batchId: 'BATCH_TN_PARA_20240520_D4E5F6', drug: 'Paracetamol', quantity: 800, from: 'MedDist Chennai', to: 'SubDist Tambaram', direction: 'outgoing', status: 'accepted', initiatedDate: '25 May 2024', completedDate: '26 May 2024', txHash: '0xdef456...789' },
  { id: 'tr5', batchId: 'BATCH_TN_AMOX_20240530_E4F5D6', drug: 'Amoxicillin', quantity: 200, from: 'MedDist Chennai', to: 'Clinic Adyar', direction: 'outgoing', status: 'rejected', initiatedDate: '28 May 2024', completedDate: '29 May 2024' },
  { id: 'tr6', batchId: 'BATCH_TN_METF_20240528_A1B2C3', drug: 'Metformin', quantity: 600, from: 'MedDist Chennai', to: 'SubDist Velachery', direction: 'outgoing', status: 'pending', initiatedDate: '3 Jun 2024' },
  { id: 'tr7', batchId: 'BATCH_TN_CHLO_20240603_P6Q7R8', drug: 'Chloroquine', quantity: 1000, from: 'PharmaCorp', to: 'MedDist Chennai', direction: 'incoming', status: 'pending', initiatedDate: '3 Jun 2024' },
];

function generateHex(len: number): string {
  const chars = '0123456789ABCDEF';
  let result = '';
  for (let i = 0; i < len; i++) result += chars[Math.floor(Math.random() * 16)];
  return result;
}

export function useTransfers() {
  const [transfers, setTransfers] = useState<TransferItem[]>(MOCK_TRANSFERS);
  const [directionFilter, setDirectionFilter] = useState<'all' | 'incoming' | 'outgoing'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

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
    await new Promise((r) => setTimeout(r, 1500));
    const transferId = `tr${Date.now()}`;
    const result: TransferResult = {
      transferId,
      batchId: data.batchId,
      txHash: `0x${generateHex(64)}`,
      blockNumber: 48000 + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      gasUsed: 52000 + Math.floor(Math.random() * 8000),
    };
    setTransfers((prev) => [
      ...prev,
      {
        id: transferId,
        batchId: data.batchId,
        drug: data.drug,
        quantity: data.quantity,
        from: 'MedDist Chennai',
        to: data.toName,
        direction: 'outgoing' as TransferDirection,
        status: 'pending' as TransferStatus,
        initiatedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      },
    ]);
    return result;
  }, []);

  const acceptTransfer = useCallback(async (id: string) => {
    await new Promise((r) => setTimeout(r, 1000));
    setTransfers((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: 'accepted' as TransferStatus, completedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }), txHash: `0x${generateHex(64)}` } : t,
      ),
    );
  }, []);

  const rejectTransfer = useCallback(async (id: string) => {
    await new Promise((r) => setTimeout(r, 1000));
    setTransfers((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: 'rejected' as TransferStatus, completedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) } : t,
      ),
    );
  }, []);

  return { transfers: filtered, pending, directionFilter, setDirectionFilter, statusFilter, setStatusFilter, getTransfer, initiateTransfer, acceptTransfer, rejectTransfer };
}
