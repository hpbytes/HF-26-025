import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { StockItem } from '@/hooks/use-distributors';

interface Props {
  items: StockItem[];
}

const STATUS_ICON: Record<string, string> = { ok: '🟢', low: '🟡', critical: '🔴' };
const STATUS_LABEL: Record<string, string> = { ok: 'OK', low: 'Low', critical: 'Crit' };

export function StockTable({ items }: Props) {
  return (
    <View style={styles.table}>
      <View style={styles.headerRow}>
        <ThemedText style={[styles.cell, styles.headerText, { flex: 2 }]}>Drug</ThemedText>
        <ThemedText style={[styles.cell, styles.headerText]}>Qty</ThemedText>
        <ThemedText style={[styles.cell, styles.headerText]}>Status</ThemedText>
      </View>
      {items.map((item, i) => (
        <View key={i} style={[styles.row, i % 2 === 0 && styles.rowAlt]}>
          <ThemedText style={[styles.cell, { flex: 2 }]}>{item.drug}</ThemedText>
          <ThemedText style={styles.cell}>{item.quantity.toLocaleString()}</ThemedText>
          <ThemedText style={styles.cell}>
            {STATUS_ICON[item.status]} {STATUS_LABEL[item.status]}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  table: { borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: '#e5e7eb' },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  headerText: { fontWeight: '700', fontSize: 13, color: '#555' },
  row: { flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 12 },
  rowAlt: { backgroundColor: '#fafafa' },
  cell: { flex: 1, fontSize: 14 },
});
