import { StyleSheet, View, ScrollView, TouchableOpacity, Clipboard } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { BatchResult } from '@/hooks/use-batch';

interface Props {
  batch: BatchResult;
  onBack: () => void;
}

export function TxReceipt({ batch, onBack }: Props) {
  const copyTxHash = () => {
    if (typeof Clipboard?.setString === 'function') {
      Clipboard.setString(batch.txHash);
    }
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <ThemedText type="title" style={styles.heading}>Transaction Receipt</ThemedText>

      {/* Status header */}
      <View style={styles.statusCard}>
        <View style={styles.statusRow}>
          <ThemedText style={styles.statusLabel}>Status</ThemedText>
          <View style={styles.confirmedBadge}>
            <ThemedText style={styles.confirmedText}>✅ Confirmed</ThemedText>
          </View>
        </View>

        <View style={styles.statusRow}>
          <ThemedText style={styles.statusLabel}>Tx Hash</ThemedText>
          <View style={styles.hashRow}>
            <ThemedText style={styles.mono} numberOfLines={1}>
              {batch.txHash.slice(0, 16)}...{batch.txHash.slice(-4)}
            </ThemedText>
            <TouchableOpacity onPress={copyTxHash}>
              <ThemedText style={styles.copyBtn}>Copy</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        <InfoRow label="Block" value={`#${batch.blockNumber}`} />
        <InfoRow label="Timestamp" value={new Date(batch.timestamp).toLocaleString()} />
        <InfoRow label="Gas Used" value={batch.gasUsed.toLocaleString()} />
        <InfoRow label="Network" value="Ganache Local" />
      </View>

      {/* Batch details */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>─── Batch Details ───</ThemedText>
        <InfoRow label="Drug" value={batch.drug} />
        <InfoRow label="Batch ID" value={batch.batchId} mono />
        <InfoRow label="Quantity" value={batch.quantity.toLocaleString()} />
        <InfoRow label="Expiry" value={batch.expiryDate} />
        <InfoRow label="Assigned" value={batch.distributor} />
        <InfoRow label="Region" value={batch.region} />
      </View>

      <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.8}>
        <ThemedText style={styles.backText}>← Back to QR</ThemedText>
      </TouchableOpacity>
    </ScrollView>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <View style={styles.infoRow}>
      <ThemedText style={styles.infoLabel}>{label}</ThemedText>
      <ThemedText style={[styles.infoValue, mono && styles.monoSmall]} numberOfLines={1}>
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: { padding: 20, paddingBottom: 40 },
  heading: { fontSize: 22, marginBottom: 20, color: '#0a7ea4' },
  statusCard: {
    backgroundColor: '#f8fcfe',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#d0e8f0',
    gap: 12,
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: { fontSize: 14, color: '#888' },
  confirmedBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  confirmedText: { color: '#16a34a', fontWeight: '600', fontSize: 13 },
  hashRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  mono: { fontFamily: 'monospace', fontSize: 12, color: '#333' },
  copyBtn: { color: '#0a7ea4', fontWeight: '600', fontSize: 13 },
  section: {
    backgroundColor: '#fafafa',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
    gap: 10,
    marginBottom: 24,
  },
  sectionTitle: { textAlign: 'center', color: '#888', fontSize: 13, marginBottom: 4 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: { fontSize: 14, color: '#888' },
  infoValue: { fontSize: 14, fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
  monoSmall: { fontFamily: 'monospace', fontSize: 11 },
  backBtn: {
    height: 48,
    borderWidth: 1.5,
    borderColor: '#0a7ea4',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { color: '#0a7ea4', fontSize: 15, fontWeight: '600' },
});
