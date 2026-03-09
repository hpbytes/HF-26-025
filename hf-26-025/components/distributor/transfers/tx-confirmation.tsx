import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import type { TransferResult } from '@/hooks/use-transfers';

interface Props {
  result: TransferResult;
  onDone: () => void;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <ThemedText style={styles.value}>{value}</ThemedText>
    </View>
  );
}

export function TxConfirmation({ result, onDone }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.iconWrap}>
        <ThemedText style={styles.checkIcon}>✓</ThemedText>
      </View>
      <ThemedText style={styles.title}>Transfer Submitted</ThemedText>
      <ThemedText style={styles.subtitle}>The transfer has been recorded on-chain</ThemedText>

      <View style={styles.card}>
        <InfoRow label="Transfer ID" value={result.transferId} />
        <InfoRow label="Batch ID" value={result.batchId} />
        <InfoRow label="Tx Hash" value={`${result.txHash.slice(0, 18)}...`} />
        <InfoRow label="Block" value={`#${result.blockNumber}`} />
        <InfoRow label="Gas Used" value={result.gasUsed.toLocaleString()} />
        <InfoRow label="Timestamp" value={new Date(result.timestamp).toLocaleString()} />
      </View>

      <TouchableOpacity style={styles.doneBtn} onPress={onDone} activeOpacity={0.7}>
        <ThemedText style={styles.doneText}>Back to Transfers</ThemedText>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: 20,
  },
  checkIcon: { fontSize: 32, color: '#16a34a' },
  title: { fontSize: 22, fontWeight: '700', color: '#11181C', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#687076', marginBottom: 24 },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f3f3f3' },
  label: { fontSize: 14, color: '#687076' },
  value: { fontSize: 14, fontWeight: '600', color: '#11181C', flexShrink: 1, textAlign: 'right' },
  doneBtn: { marginTop: 28, backgroundColor: '#0a7ea4', borderRadius: 10, paddingVertical: 14, paddingHorizontal: 40 },
  doneText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
