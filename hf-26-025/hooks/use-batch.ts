import { useState, useCallback } from 'react';
import { api } from '@/services/api';

export interface BatchFormData {
  drug: string;
  drugCode: string;
  quantity: string;
  manufactureDate: string;
  expiryDate: string;
  region: string;
  distributorId: string;
}

export interface BatchResult {
  batchId: string;
  drug: string;
  quantity: number;
  manufactureDate: string;
  expiryDate: string;
  region: string;
  distributor: string;
  manufacturer: string;
  qrHash: string;
  txHash: string;
  blockNumber: number;
  timestamp: string;
  gasUsed: number;
}

function generateHex(len: number): string {
  const chars = '0123456789ABCDEF';
  let result = '';
  for (let i = 0; i < len; i++) result += chars[Math.floor(Math.random() * 16)];
  return result;
}

export function generateBatchId(drugCode: string): string {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  return `BATCH_TN_${drugCode}_${date}_${generateHex(6)}`;
}

export function useBatch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerBatch = useCallback(async (form: BatchFormData): Promise<BatchResult> => {
    setLoading(true);
    setError(null);

    try {
      const qrHash = `0x${generateHex(40)}`;
      const mfgTs = Math.floor(new Date(form.manufactureDate).getTime() / 1000);
      const expTs = Math.floor(new Date(form.expiryDate).getTime() / 1000);

      const res = await api.post<{ txHash: string; batchId: string }>('/batches', {
        drugName: form.drug,
        region: form.region,
        quantity: parseInt(form.quantity, 10),
        manufactureDate: mfgTs,
        expiryDate: expTs,
        qrCodeHash: qrHash,
      });

      const result: BatchResult = {
        batchId: res.batchId,
        drug: form.drug,
        quantity: parseInt(form.quantity, 10),
        manufactureDate: form.manufactureDate,
        expiryDate: form.expiryDate,
        region: form.region,
        distributor: form.distributorId,
        manufacturer: 'On-Chain',
        qrHash,
        txHash: res.txHash,
        blockNumber: 0,
        timestamp: new Date().toISOString(),
        gasUsed: 0,
      };

      return result;
    } catch (e: any) {
      const msg = e.message || 'Failed to register batch';
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { registerBatch, loading, error };
}
