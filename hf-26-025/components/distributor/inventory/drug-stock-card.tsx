import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import type { StockStatus } from '@/hooks/use-inventory';

interface Props {
  drug: string;
  drugCode: string;
  totalQuantity: number;
  status: StockStatus;
  batchCount: number;
  onPress: () => void;
}

const STATUS_CONFIG: Record<StockStatus, { color: string; bg: string; label: string }> = {
  ok: { color: '#16a34a', bg: '#f0fdf4', label: 'OK' },
  low: { color: '#ca8a04', bg: '#fefce8', label: 'Low' },
  critical: { color: '#dc2626', bg: '#fef2f2', label: 'Critical' },
};

export function DrugStockCard({ drug, drugCode, totalQuantity, status, batchCount, onPress }: Props) {
  const cfg = STATUS_CONFIG[status];

  return (
    <TouchableOpacity style={[styles.card, { borderLeftColor: cfg.color }]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <ThemedText style={styles.drugName}>{drug}</ThemedText>
        <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
          <ThemedText style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</ThemedText>
        </View>
      </View>
      <View style={styles.row}>
        <ThemedText style={styles.label}>Code</ThemedText>
        <ThemedText style={styles.value}>{drugCode}</ThemedText>
      </View>
      <View style={styles.row}>
        <ThemedText style={styles.label}>Total Quantity</ThemedText>
        <ThemedText style={styles.value}>{totalQuantity.toLocaleString()}</ThemedText>
      </View>
      <View style={styles.row}>
        <ThemedText style={styles.label}>Batches</ThemedText>
        <ThemedText style={styles.value}>{batchCount}</ThemedText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  drugName: { fontSize: 17, fontWeight: '700', color: '#11181C' },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  label: { fontSize: 14, color: '#687076' },
  value: { fontSize: 14, fontWeight: '600', color: '#11181C' },
});
