import { useState, useCallback } from 'react';
import { DRUGS, MOCK_DISTRIBUTORS } from '@/constants/medchain';

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
      const batchId = generateBatchId(form.drugCode);
      const dist = MOCK_DISTRIBUTORS.find((d) => d.id === form.distributorId);
      const drug = DRUGS.find((d) => d.code === form.drugCode);

      // Simulate API call delay
      await new Promise((r) => setTimeout(r, 1500));

      const result: BatchResult = {
        batchId,
        drug: drug?.name || form.drug,
        quantity: parseInt(form.quantity, 10),
        manufactureDate: form.manufactureDate,
        expiryDate: form.expiryDate,
        region: form.region,
        distributor: dist?.name || 'Unknown',
        manufacturer: '0xABC...manufacturer',
        qrHash: `0x${generateHex(40)}`,
        txHash: `0x${generateHex(64)}`,
        blockNumber: 48000 + Math.floor(Math.random() * 1000),
        timestamp: new Date().toISOString(),
        gasUsed: 45000 + Math.floor(Math.random() * 10000),
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
