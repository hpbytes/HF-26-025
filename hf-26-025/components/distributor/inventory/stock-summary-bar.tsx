import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';

interface Props {
  total: number;
  ok: number;
  low: number;
  critical: number;
}

export function StockSummaryBar({ total, ok, low, critical }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <ThemedText style={styles.count}>{total}</ThemedText>
        <ThemedText style={styles.label}>Total Drugs</ThemedText>
      </View>
      <View style={styles.divider} />
      <View style={styles.item}>
        <ThemedText style={[styles.count, { color: '#16a34a' }]}>{ok}</ThemedText>
        <ThemedText style={styles.label}>OK</ThemedText>
      </View>
      <View style={styles.divider} />
      <View style={styles.item}>
        <ThemedText style={[styles.count, { color: '#ca8a04' }]}>{low}</ThemedText>
        <ThemedText style={styles.label}>Low</ThemedText>
      </View>
      <View style={styles.divider} />
      <View style={styles.item}>
        <ThemedText style={[styles.count, { color: '#dc2626' }]}>{critical}</ThemedText>
        <ThemedText style={styles.label}>Critical</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  item: { flex: 1, alignItems: 'center' },
  divider: { width: 1, backgroundColor: '#e5e7eb' },
  count: { fontSize: 24, fontWeight: '700', color: '#11181C' },
  label: { fontSize: 12, color: '#687076', marginTop: 2 },
});
