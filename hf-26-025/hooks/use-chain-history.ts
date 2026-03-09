import { useState, useCallback, useEffect } from 'react';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/auth-context';

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

interface RawAuditEntry {
  entryId: string;
  batchId: string;
  action: string;
  performedBy: string;
  timestamp: number;
  metadata: string;
}

function fmtDate(ts: number): string {
  if (!ts) return '';
  const d = new Date(ts * 1000);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' +
    d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function shortAddr(a: string): string {
  return a.length > 10 ? a.slice(0, 6) + '...' + a.slice(-4) : a;
}

function inferRole(action: string): string {
  if (action.includes('BATCH_CREATED')) return 'Manufacturer';
  if (action.includes('TRANSFER')) return 'Distributor';
  if (action.includes('FLAG') || action.includes('EXPIR')) return 'Audit Contract';
  return 'System';
}

function mapEntry(e: RawAuditEntry, drug: string): AuditEntry {
  return {
    id: e.entryId,
    action: e.action as AuditAction,
    batchId: e.batchId,
    drug,
    actor: shortAddr(e.performedBy),
    actorRole: inferRole(e.action),
    timestamp: fmtDate(e.timestamp),
    txHash: '',
    blockNumber: 0,
    details: e.metadata || e.action.replace(/_/g, ' ').toLowerCase(),
  };
}

export function useChainHistory() {
  const { wallet } = useAuth();
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [batchChains, setBatchChains] = useState<Map<string, BatchChain>>(new Map());
  const [actionFilter, setActionFilter] = useState<'all' | AuditAction>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!wallet) { setLoading(false); return; }
    setLoading(true);

    api.get<{ entries: RawAuditEntry[] }>(`/audit/wallet/${encodeURIComponent(wallet)}`)
      .then(async (r) => {
        // Get drug names for each unique batchId
        const batchIds = [...new Set(r.entries.map((e) => e.batchId))];
        const drugMap = new Map<string, string>();
        await Promise.all(
          batchIds.slice(0, 20).map(async (bid) => {
            try {
              const b = await api.get<{ drugName: string }>(`/batches/${encodeURIComponent(bid)}`);
              drugMap.set(bid, b.drugName);
            } catch { drugMap.set(bid, bid); }
          }),
        );

        setAuditLog(r.entries.map((e) => mapEntry(e, drugMap.get(e.batchId) || e.batchId)));
      })
      .catch(() => setAuditLog([]))
      .finally(() => setLoading(false));
  }, [wallet]);

  const filtered = auditLog.filter((e) => {
    if (actionFilter === 'all') return true;
    return e.action === actionFilter;
  });

  const getEntry = useCallback(
    (id: string): AuditEntry | undefined => auditLog.find((e) => e.id === id),
    [auditLog],
  );

  const getBatchChain = useCallback(
    (batchId: string): BatchChain | undefined => {
      if (batchChains.has(batchId)) return batchChains.get(batchId);

      // Trigger async load
      api.get<{ entries: RawAuditEntry[] }>(`/audit/trail/${encodeURIComponent(batchId)}`)
        .then(async (r) => {
          let drug = batchId;
          let manufacturer = '';
          try {
            const b = await api.get<{ drugName: string; registeredBy: string }>(`/batches/${encodeURIComponent(batchId)}`);
            drug = b.drugName;
            manufacturer = shortAddr(b.registeredBy);
          } catch {}

          const chain: BatchChain = {
            batchId,
            drug,
            manufacturer,
            createdDate: r.entries.length > 0 ? fmtDate(r.entries[0].timestamp) : '',
            custody: r.entries.map((e, i) => ({
              step: i + 1,
              actor: shortAddr(e.performedBy),
              role: inferRole(e.action),
              action: e.action.replace(/_/g, ' ').toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase()),
              timestamp: fmtDate(e.timestamp),
              txHash: '',
            })),
          };
          setBatchChains((prev) => new Map(prev).set(batchId, chain));
        })
        .catch(() => {});

      return undefined;
    },
    [batchChains],
  );

  return { auditLog: filtered, actionFilter, setActionFilter, getEntry, getBatchChain, loading };
}
