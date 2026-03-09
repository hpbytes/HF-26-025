import { StyleSheet, View, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import type { InitiateTransferData } from '@/hooks/use-transfers';

interface Props {
  data: InitiateTransferData;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <ThemedText style={styles.value}>{value}</ThemedText>
    </View>
  );
}

export function TransferSummary({ data }: Props) {
  return (
    <View style={styles.card}>
      <ThemedText style={styles.title}>Transfer Summary</ThemedText>
      <InfoRow label="Drug" value={data.drug} />
      <InfoRow label="Batch ID" value={data.batchId} />
      <InfoRow label="Quantity" value={data.quantity.toLocaleString()} />
      <InfoRow label="Recipient" value={data.toName} />
      <InfoRow label="Wallet" value={data.toWallet} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  title: { fontSize: 16, fontWeight: '700', color: '#11181C', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#f3f3f3' },
  label: { fontSize: 14, color: '#687076' },
  value: { fontSize: 14, fontWeight: '600', color: '#11181C', flexShrink: 1, textAlign: 'right' },
});
