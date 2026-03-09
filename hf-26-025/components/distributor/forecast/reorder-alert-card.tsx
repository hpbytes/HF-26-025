import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import type { ReorderAlert } from '@/hooks/use-forecast';

interface Props {
  alert: ReorderAlert;
  onPress?: () => void;
}

const URGENCY_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  urgent: { color: '#dc2626', bg: '#fef2f2', label: 'Urgent' },
  soon: { color: '#ca8a04', bg: '#fefce8', label: 'Reorder Soon' },
  planned: { color: '#0a7ea4', bg: '#e8f4f8', label: 'Planned' },
};

export function ReorderAlertCard({ alert, onPress }: Props) {
  const cfg = URGENCY_CONFIG[alert.urgency];

  return (
    <TouchableOpacity style={[styles.card, { borderLeftColor: cfg.color }]} onPress={onPress} activeOpacity={0.7} disabled={!onPress}>
      <View style={styles.header}>
        <ThemedText style={styles.drug}>{alert.drug}</ThemedText>
        <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
          <ThemedText style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</ThemedText>
        </View>
      </View>
      <View style={styles.row}>
        <ThemedText style={styles.label}>Current Stock</ThemedText>
        <ThemedText style={styles.value}>{alert.currentStock.toLocaleString()}</ThemedText>
      </View>
      <View style={styles.row}>
        <ThemedText style={styles.label}>30-Day Demand</ThemedText>
        <ThemedText style={styles.value}>{alert.predictedDemand30.toLocaleString()}</ThemedText>
      </View>
      <View style={styles.row}>
        <ThemedText style={styles.label}>Days Until Stockout</ThemedText>
        <ThemedText style={[styles.value, alert.daysUntilStockout <= 7 && { color: '#dc2626' }]}>
          {alert.daysUntilStockout} days
        </ThemedText>
      </View>
      <View style={styles.row}>
        <ThemedText style={styles.label}>Suggested Order</ThemedText>
        <ThemedText style={[styles.value, { color: '#0a7ea4' }]}>{alert.suggestedOrder.toLocaleString()} units</ThemedText>
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
  drug: { fontSize: 17, fontWeight: '700', color: '#11181C' },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  label: { fontSize: 14, color: '#687076' },
  value: { fontSize: 14, fontWeight: '600', color: '#11181C' },
});
