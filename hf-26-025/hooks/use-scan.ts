import { useState, useCallback } from 'react';

export type ScanState = 'scanning' | 'loading' | 'result';
export type VerifyResult = 'authentic' | 'expired' | 'invalid';

export interface CustodyEntry {
  step: number;
  actor: string;
  role: string;
  action: string;
  timestamp: string;
}

export interface ScanResult {
  result: VerifyResult;
  drug?: string;
  form?: string;
  batchId: string;
  manufacturer?: string;
  manufacturerVerified?: boolean;
  registeredDate?: string;
  expiryDate?: string;
  daysLeft?: number;
  safeToUse?: boolean;
  custody?: CustodyEntry[];
  txHash?: string;
  blockNumber?: number;
  reason?: string;
}

function generateHex(len: number): string {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < len; i++) result += chars[Math.floor(Math.random() * 16)];
  return result;
}

const MOCK_VALID: ScanResult = {
  result: 'authentic',
  drug: 'Paracetamol',
  form: '500mg tablet',
  batchId: 'BATCH_TN_PARA_20240601_A3F9C1',
  manufacturer: 'MedCorp TN',
  manufacturerVerified: true,
  registeredDate: '28 May 2024',
  expiryDate: 'June 2027',
  daysLeft: 1095,
  safeToUse: true,
  custody: [
    { step: 1, actor: 'MedCorp TN', role: 'Manufacturer', action: 'Manufactured', timestamp: '28 May 2024' },
    { step: 2, actor: 'MedDist Chennai', role: 'Distributor', action: 'Received', timestamp: '01 Jun 2024' },
    { step: 3, actor: 'You (Patient Verified)', role: 'Patient', action: 'Verified', timestamp: 'Now' },
  ],
  txHash: `0x4f3a${generateHex(56)}c9d2`,
  blockNumber: 48291,
};

const MOCK_EXPIRED: ScanResult = {
  result: 'expired',
  drug: 'Paracetamol',
  form: '500mg tablet',
  batchId: 'BATCH_TN_PARA_20230101_X1Y2Z3',
  expiryDate: 'January 2024',
  daysLeft: -430,
  safeToUse: false,
};

const MOCK_INVALID: ScanResult = {
  result: 'invalid',
  batchId: 'BATCH_TN_XXX_UNKNOWN',
  reason: 'Batch not found on blockchain',
};

export function useScan() {
  const [state, setState] = useState<ScanState>('scanning');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  const verifyBatch = useCallback(async (batchId: string): Promise<ScanResult> => {
    setState('loading');
    await new Promise((r) => setTimeout(r, 1500));

    let result: ScanResult;
    const upper = batchId.toUpperCase();
    if (upper.includes('EXPIRED') || upper.includes('20230')) {
      result = { ...MOCK_EXPIRED, batchId };
    } else if (upper.includes('XXX') || upper.includes('FAKE') || upper.includes('UNKNOWN')) {
      result = { ...MOCK_INVALID, batchId };
    } else {
      result = { ...MOCK_VALID, batchId, txHash: `0x${generateHex(64)}` };
    }

    setScanResult(result);
    setState('result');
    return result;
  }, []);

  const resetScan = useCallback(() => {
    setState('scanning');
    setScanResult(null);
  }, []);

  return { state, scanResult, verifyBatch, resetScan };
}
