import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import type { BatchStock } from '@/hooks/use-inventory';

interface Props {
  batches: BatchStock[];
}

export function BatchBreakdownCard({ batches }: Props) {
  return (
    <View style={styles.card}>
      <ThemedText style={styles.title}>Batch Breakdown</ThemedText>
      <View style={styles.headerRow}>
        <ThemedText style={[styles.headerCell, { flex: 2 }]}>Batch ID</ThemedText>
        <ThemedText style={styles.headerCell}>Qty</ThemedText>
        <ThemedText style={styles.headerCell}>Expiry</ThemedText>
      </View>
      {batches.map((b, i) => (
        <View key={b.batchId} style={[styles.row, i % 2 === 1 && styles.altRow]}>
          <ThemedText style={[styles.cell, { flex: 2 }]} numberOfLines={1}>{b.batchId}</ThemedText>
          <ThemedText style={styles.cell}>{b.quantity.toLocaleString()}</ThemedText>
          <ThemedText style={styles.cell}>{b.expiryDate}</ThemedText>
        </View>
      ))}
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
  headerRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingBottom: 8, marginBottom: 4 },
  headerCell: { flex: 1, fontSize: 12, fontWeight: '600', color: '#687076' },
  row: { flexDirection: 'row', paddingVertical: 8 },
  altRow: { backgroundColor: '#f9fafb' },
  cell: { flex: 1, fontSize: 13, color: '#11181C' },
});
