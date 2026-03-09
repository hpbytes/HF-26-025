import { useState, useCallback } from 'react';

export type AuditAction = 'BATCH_CREATED' | 'TRANSFER_INITIATED' | 'TRANSFER_ACCEPTED' | 'TRANSFER_REJECTED' | 'BATCH_FLAGGED' | 'BATCH_DEACTIVATED' | 'EXPIRY_CHECK';

export interface AuditEntry {
  id: string;
  action: AuditAction;
  batchId: string;
  drug: string;
  actor: string;
  actorRole: string;
  timestamp: string;
  txHash: string;
  blockNumber: number;
  details: string;
}

export interface CustodyEntry {
  step: number;
  actor: string;
  role: string;
  action: string;
  timestamp: string;
  txHash: string;
  location?: string;
}

export interface BatchChain {
  batchId: string;
  drug: string;
  manufacturer: string;
  createdDate: string;
  custody: CustodyEntry[];
}

const MOCK_AUDIT: AuditEntry[] = [
  { id: 'au1', action: 'TRANSFER_ACCEPTED', batchId: 'BATCH_TN_PARA_20240602_A1B2C3', drug: 'Paracetamol', actor: '0xaA36...AeF', actorRole: 'Distributor', timestamp: '2 Jun 2024, 14:30', txHash: '0xabc123def456...', blockNumber: 48521, details: 'Accepted 2500 units from PharmaCorp' },
  { id: 'au2', action: 'TRANSFER_INITIATED', batchId: 'BATCH_TN_PARA_20240520_D4E5F6', drug: 'Paracetamol', actor: '0xaA36...AeF', actorRole: 'Distributor', timestamp: '25 May 2024, 10:15', txHash: '0xdef789abc012...', blockNumber: 48340, details: 'Initiated transfer of 800 units to SubDist Tambaram' },
  { id: 'au3', action: 'TRANSFER_ACCEPTED', batchId: 'BATCH_TN_ARTE_20240529_F3A1B2', drug: 'Artemether', actor: '0xaA36...AeF', actorRole: 'Distributor', timestamp: '29 May 2024, 09:45', txHash: '0x456789abc012...', blockNumber: 48410, details: 'Accepted 180 units from MediGen Labs' },
  { id: 'au4', action: 'BATCH_FLAGGED', batchId: 'BATCH_TN_INSU_20240601_C9D2E1', drug: 'Insulin', actor: 'System', actorRole: 'ML Engine', timestamp: '3 Jun 2024, 12:00', txHash: '0x789012def345...', blockNumber: 48550, details: 'Flagged: Stock dropped 62% in 4 hours' },
  { id: 'au5', action: 'TRANSFER_REJECTED', batchId: 'BATCH_TN_AMOX_20240530_E4F5D6', drug: 'Amoxicillin', actor: 'Clinic Adyar', actorRole: 'Patient Facility', timestamp: '29 May 2024, 16:20', txHash: '0x012345abc678...', blockNumber: 48425, details: 'Rejected 200 units — packaging damaged' },
  { id: 'au6', action: 'EXPIRY_CHECK', batchId: 'BATCH_TN_INSU_20240601_C9D2E1', drug: 'Insulin', actor: 'System', actorRole: 'Audit Contract', timestamp: '4 Jun 2024, 00:00', txHash: '0x345678def901...', blockNumber: 48600, details: 'Expiry check: 168 days remaining' },
  { id: 'au7', action: 'BATCH_CREATED', batchId: 'BATCH_TN_METF_20240528_A1B2C3', drug: 'Metformin', actor: '0x9Aac...51C', actorRole: 'Manufacturer', timestamp: '28 May 2024, 08:00', txHash: '0x678901abc234...', blockNumber: 48290, details: 'Batch created with 3200 units' },
];

const MOCK_CHAINS: Record<string, BatchChain> = {
  'BATCH_TN_PARA_20240602_A1B2C3': {
    batchId: 'BATCH_TN_PARA_20240602_A1B2C3',
    drug: 'Paracetamol',
    manufacturer: 'PharmaCorp',
    createdDate: '15 May 2024',
    custody: [
      { step: 1, actor: 'PharmaCorp', role: 'Manufacturer', action: 'Created batch', timestamp: '15 May 2024, 08:00', txHash: '0x111aaa...', location: 'Chennai Factory' },
      { step: 2, actor: 'PharmaCorp', role: 'Manufacturer', action: 'Initiated transfer', timestamp: '1 Jun 2024, 10:00', txHash: '0x222bbb...', location: 'Chennai Factory' },
      { step: 3, actor: 'MedDist Chennai', role: 'Distributor', action: 'Accepted transfer', timestamp: '2 Jun 2024, 14:30', txHash: '0x333ccc...', location: 'Chennai Warehouse' },
    ],
  },
  'BATCH_TN_ARTE_20240529_F3A1B2': {
    batchId: 'BATCH_TN_ARTE_20240529_F3A1B2',
    drug: 'Artemether',
    manufacturer: 'MediGen Labs',
    createdDate: '10 May 2024',
    custody: [
      { step: 1, actor: 'MediGen Labs', role: 'Manufacturer', action: 'Created batch', timestamp: '10 May 2024, 09:00', txHash: '0x444ddd...', location: 'Madurai Plant' },
      { step: 2, actor: 'MediGen Labs', role: 'Manufacturer', action: 'Initiated transfer', timestamp: '28 May 2024, 11:00', txHash: '0x555eee...' },
      { step: 3, actor: 'MedDist Chennai', role: 'Distributor', action: 'Accepted transfer', timestamp: '29 May 2024, 09:45', txHash: '0x666fff...', location: 'Chennai Warehouse' },
    ],
  },
};

export function useChainHistory() {
  const [auditLog] = useState<AuditEntry[]>(MOCK_AUDIT);
  const [actionFilter, setActionFilter] = useState<'all' | AuditAction>('all');

  const filtered = auditLog.filter((e) => {
    if (actionFilter === 'all') return true;
    return e.action === actionFilter;
  });

  const getEntry = useCallback(
    (id: string): AuditEntry | undefined => auditLog.find((e) => e.id === id),
    [auditLog],
  );

  const getBatchChain = useCallback(
    (batchId: string): BatchChain | undefined => MOCK_CHAINS[batchId],
    [],
  );

  return { auditLog: filtered, actionFilter, setActionFilter, getEntry, getBatchChain };
}
