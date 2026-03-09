import { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AuditLogCard } from '@/components/distributor/chain/audit-log-card';
import { CustodyTimeline } from '@/components/distributor/chain/custody-timeline';
import { TxHashBadge } from '@/components/distributor/chain/tx-hash-badge';
import { useChainHistory, type AuditAction } from '@/hooks/use-chain-history';

type HistoryView = 'log' | 'batchDetail';

const ACTION_FILTERS: { label: string; value: 'all' | AuditAction }[] = [
  { label: 'All', value: 'all' },
  { label: 'Created', value: 'BATCH_CREATED' },
  { label: 'Transfers', value: 'TRANSFER_ACCEPTED' },
  { label: 'Flagged', value: 'BATCH_FLAGGED' },
  { label: 'Expiry', value: 'EXPIRY_CHECK' },
];

export default function ChainHistoryScreen() {
  const { auditLog, actionFilter, setActionFilter, getEntry, getBatchChain } = useChainHistory();
  const [view, setView] = useState<HistoryView>('log');
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  if (view === 'batchDetail' && selectedBatchId) {
    const chain = getBatchChain(selectedBatchId);
    const entry = selectedEntryId ? getEntry(selectedEntryId) : undefined;

    return (
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <TouchableOpacity onPress={() => { setView('log'); setSelectedBatchId(null); setSelectedEntryId(null); }}>
            <ThemedText style={styles.backLink}>← Back to Log</ThemedText>
          </TouchableOpacity>

          {entry && (
            <>
              <ThemedText type="title" style={styles.title}>{entry.drug}</ThemedText>
              <View style={styles.card}>
                <View style={styles.row}>
                  <ThemedText style={styles.label}>Action</ThemedText>
                  <ThemedText style={styles.value}>{entry.action.replace(/_/g, ' ')}</ThemedText>
                </View>
                <View style={styles.row}>
                  <ThemedText style={styles.label}>Actor</ThemedText>
                  <ThemedText style={styles.value}>{entry.actorRole}</ThemedText>
                </View>
                <View style={styles.row}>
                  <ThemedText style={styles.label}>Timestamp</ThemedText>
                  <ThemedText style={styles.value}>{entry.timestamp}</ThemedText>
                </View>
                <View style={styles.row}>
                  <ThemedText style={styles.label}>Details</ThemedText>
                  <ThemedText style={[styles.value, { flex: 1 }]}>{entry.details}</ThemedText>
                </View>
              </View>

              <View style={{ height: 12 }} />
              <TxHashBadge hash={entry.txHash} blockNumber={entry.blockNumber} />
            </>
          )}

          {chain && (
            <>
              <View style={{ height: 20 }} />
              <CustodyTimeline chain={chain} />
            </>
          )}

          {!chain && (
            <View style={styles.noChain}>
              <ThemedText style={styles.noChainText}>No custody chain data available for this batch</ThemedText>
            </View>
          )}
        </ScrollView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedText type="title" style={styles.title}>Chain History</ThemedText>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <View style={styles.filterRow}>
            {ACTION_FILTERS.map((f) => (
              <TouchableOpacity
                key={f.value}
                style={[styles.filterChip, actionFilter === f.value && styles.filterActive]}
                onPress={() => setActionFilter(f.value)}>
                <ThemedText style={[styles.filterText, actionFilter === f.value && styles.filterTextActive]}>
                  {f.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.list}>
          {auditLog.map((entry) => (
            <AuditLogCard
              key={entry.id}
              entry={entry}
              onPress={() => {
                setSelectedEntryId(entry.id);
                setSelectedBatchId(entry.batchId);
                setView('batchDetail');
              }}
            />
          ))}
          {auditLog.length === 0 && (
            <ThemedText style={styles.empty}>No audit entries match the current filter</ThemedText>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 40 },
  title: { marginBottom: 16 },
  backLink: { color: '#0a7ea4', fontSize: 15, fontWeight: '600', marginBottom: 16 },
  filterScroll: { marginBottom: 16 },
  filterRow: { flexDirection: 'row', gap: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#f3f4f6' },
  filterActive: { backgroundColor: '#0a7ea4' },
  filterText: { fontSize: 13, fontWeight: '600', color: '#687076' },
  filterTextActive: { color: '#fff' },
  list: { gap: 12 },
  empty: { textAlign: 'center', color: '#687076', marginTop: 40, fontSize: 15 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#f3f3f3' },
  label: { fontSize: 14, color: '#687076', marginRight: 12 },
  value: { fontSize: 14, fontWeight: '600', color: '#11181C', flexShrink: 1, textAlign: 'right' },
  noChain: { marginTop: 20, padding: 20, backgroundColor: '#f9fafb', borderRadius: 12, alignItems: 'center' },
  noChainText: { color: '#687076', fontSize: 14 },
});
