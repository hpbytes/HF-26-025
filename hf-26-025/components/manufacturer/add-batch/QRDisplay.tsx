import { StyleSheet, View, ScrollView, TouchableOpacity, Share } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { BatchResult } from '@/hooks/use-batch';

interface Props {
  batch: BatchResult;
  onRegisterAnother: () => void;
  onViewReceipt: () => void;
}

export function QRDisplay({ batch, onRegisterAnother, onViewReceipt }: Props) {
  const qrData = JSON.stringify(
    {
      batchId: batch.batchId,
      drug: batch.drug,
      manufacturer: batch.manufacturer,
      expiryDate: batch.expiryDate,
      qrHash: batch.qrHash,
    },
    null,
    2,
  );

  const handleShare = async () => {
    await Share.share({ message: `MedChain TN Batch\n${batch.batchId}\n\n${qrData}` });
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <View style={styles.successBadge}>
        <ThemedText style={styles.successIcon}>✅</ThemedText>
        <ThemedText type="title" style={styles.successText}>Batch Registered</ThemedText>
      </View>

      {/* QR Code placeholder */}
      <View style={styles.qrBox}>
        <View style={styles.qrInner}>
          <ThemedText style={styles.qrLabel}>QR CODE</ThemedText>
          <ThemedText style={styles.qrData} numberOfLines={6}>{qrData}</ThemedText>
        </View>
      </View>

      {/* Batch summary */}
      <View style={styles.details}>
        <DetailRow label="Batch ID" value={batch.batchId} mono />
        <DetailRow label="Drug" value={batch.drug} />
        <DetailRow label="Quantity" value={`${batch.quantity.toLocaleString()} units`} />
        <DetailRow label="Expiry" value={batch.expiryDate} />
        <DetailRow label="Region" value={batch.region} />
        <DetailRow label="Distributor" value={batch.distributor} />
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.secondaryBtn} onPress={onViewReceipt} activeOpacity={0.8}>
            <ThemedText style={styles.secondaryText}>View Receipt</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={handleShare} activeOpacity={0.8}>
            <ThemedText style={styles.secondaryText}>Share QR</ThemedText>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.primaryBtn} onPress={onRegisterAnother} activeOpacity={0.8}>
          <ThemedText style={styles.primaryText}>Register Another Batch</ThemedText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <View style={styles.detailRow}>
      <ThemedText style={styles.detailLabel}>{label}</ThemedText>
      <ThemedText style={[styles.detailValue, mono && styles.mono]} numberOfLines={1}>
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: { padding: 20, paddingBottom: 40, alignItems: 'center' },
  successBadge: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 24 },
  successIcon: { fontSize: 28 },
  successText: { color: '#16a34a', fontSize: 22 },
  qrBox: {
    width: 220,
    height: 220,
    borderWidth: 2,
    borderColor: '#0a7ea4',
    borderRadius: 16,
    padding: 12,
    marginBottom: 28,
    backgroundColor: '#f8fcfe',
  },
  qrInner: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  qrLabel: { fontSize: 14, fontWeight: '700', color: '#0a7ea4', marginBottom: 8 },
  qrData: { fontSize: 9, color: '#666', fontFamily: 'monospace', textAlign: 'left' },
  details: { width: '100%', gap: 10, marginBottom: 24 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: { fontSize: 14, color: '#888' },
  detailValue: { fontSize: 14, fontWeight: '600', maxWidth: '55%', textAlign: 'right' },
  mono: { fontFamily: 'monospace', fontSize: 12 },
  actions: { width: '100%', gap: 12 },
  row: { flexDirection: 'row', gap: 12 },
  secondaryBtn: {
    flex: 1,
    height: 48,
    borderWidth: 1.5,
    borderColor: '#0a7ea4',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: { color: '#0a7ea4', fontSize: 15, fontWeight: '600' },
  primaryBtn: {
    height: 52,
    backgroundColor: '#0a7ea4',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
